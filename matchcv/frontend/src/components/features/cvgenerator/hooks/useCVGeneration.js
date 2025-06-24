import { useState, useCallback } from 'react';
import CVService from '../../../../services/api/cv';

export const useCVGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generationSuccess, setGenerationSuccess] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Générer le PDF du CV avec jsPDF
  const generatePDF = useCallback(async (cvData, templateId, options = {}) => {
    setIsGenerating(true);
    setGenerationError('');
    setGenerationSuccess('');
    setGenerationProgress(0);

    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      setGenerationProgress(20);
      const config = {
        fontSize: options.fontSize || 12,
        lineHeight: options.lineHeight || 1.2,
        margins: options.margins || { top: 20, right: 20, bottom: 20, left: 20 },
        color: options.color || '#2563eb',
        ...options
      };
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - config.margins.left - config.margins.right;
      setGenerationProgress(40);
      const addText = (text, x, y, maxWidth, fontSize = config.fontSize) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return lines.length * fontSize * config.lineHeight;
      };
      const addSection = (title, content, startY) => {
        let currentY = startY;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(config.color);
        currentY += addText(title, config.margins.left, currentY, contentWidth, 14);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        currentY += 5;
        if (Array.isArray(content)) {
          content.forEach(item => {
            if (currentY > pageHeight - 30) {
              pdf.addPage();
              currentY = config.margins.top;
            }
            currentY += addText(`• ${item}`, config.margins.left + 5, currentY, contentWidth - 5);
          });
        } else {
          currentY += addText(content, config.margins.left, currentY, contentWidth);
        }
        return currentY + 10;
      };
      setGenerationProgress(60);
      pdf.setFillColor(config.color);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      const fullName = `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`;
      addText(fullName, config.margins.left, 25, contentWidth, 18);
      pdf.setFont('helvetica', 'normal');
      addText(cvData.personalInfo.title || '', config.margins.left, 35, contentWidth, 12);
      setGenerationProgress(80);
      let currentY = 50;
      const contactInfo = [
        cvData.personalInfo.email,
        cvData.personalInfo.phone,
        cvData.personalInfo.location
      ].filter(Boolean).join(' | ');
      pdf.setTextColor(100, 100, 100);
      addText(contactInfo, config.margins.left, currentY, contentWidth, 10);
      currentY += 15;
      if (cvData.summary) {
        currentY = addSection('Résumé Professionnel', cvData.summary, currentY);
      }
      if (cvData.experience && cvData.experience.length > 0) {
        currentY = addSection('Expérience Professionnelle', 
          cvData.experience.map(exp => 
            `${exp.position} chez ${exp.company} (${exp.period}) - ${exp.description || ''}`
          ), currentY);
      }
      if (cvData.education && cvData.education.length > 0) {
        currentY = addSection('Formation',
          cvData.education.map(edu => 
            `${edu.degree} - ${edu.school} (${edu.period})`
          ), currentY);
      }
      if (cvData.skills && cvData.skills.length > 0) {
        currentY = addSection('Compétences',
          cvData.skills.map(skill => `${skill.name} (${skill.level})`), currentY);
      }
      setGenerationProgress(90);
      const fileName = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_${templateId}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      setGenerationProgress(100);
      setGenerationSuccess(`CV téléchargé avec succès : ${fileName}`);
      return { success: true, fileName, pdf };
    } catch (error) {
      setGenerationError('Erreur lors de la génération du PDF');
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 2000);
    }
  }, []);

  // Générer un aperçu HTML avec styles
  const generatePreview = useCallback(async (cvData, templateId) => {
    try {
      const template = getTemplateStyles(templateId);
      const html = generateHTML(cvData, template);
      const preview = {
        html,
        templateId,
        timestamp: new Date().toISOString(),
        css: template.css
      };
      return preview;
    } catch (error) {
      setGenerationError('Erreur lors de la génération de l\'aperçu');
      return null;
    }
  }, []);

  // Sauvegarder le CV avec versioning
  const saveCV = useCallback(async (cvData, templateId, options = {}) => {
    setIsGenerating(true);
    setGenerationError('');
    setGenerationSuccess('');
    try {
      const result = await CVService.saveCV({
        templateId,
        title: options.title || `CV ${cvData.personalInfo?.firstName} ${cvData.personalInfo?.lastName}`,
        cvData,
        optimizedFor: options.optimizedFor || {}
      });
      
      if (result.success) {
        setGenerationSuccess(`CV sauvegardé avec succès !`);
        return { success: true, cv: result.cv };
      } else {
        setGenerationError(result.message || 'Erreur lors de la sauvegarde');
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Erreur sauvegarde CV:', error);
      setGenerationError('Erreur lors de la sauvegarde');
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Partager le CV avec QR Code
  const shareCV = useCallback(async (cvData, templateId) => {
    try {
      const shareId = `cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const shareUrl = `${window.location.origin}/cv/share/${shareId}`;
      const QRCode = await import('qrcode');
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#2563eb',
          light: '#ffffff'
        }
      });
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setGenerationSuccess('Lien de partage copié ! QR Code généré.');
      }
      return { success: true, shareUrl, shareId, qrCode: qrDataUrl };
    } catch (error) {
      setGenerationError('Erreur lors de la génération du lien de partage');
      return { success: false, error: error.message };
    }
  }, []);

  // Exporter en différents formats avec options avancées
  const exportCV = useCallback(async (cvData, templateId, format = 'pdf', options = {}) => {
    setIsGenerating(true);
    setGenerationError('');
    try {
      switch (format.toLowerCase()) {
        case 'pdf':
          return await generatePDF(cvData, templateId, options);
        case 'docx':
          const { Document, Packer, Paragraph, TextRun } = await import('docx');
          const doc = new Document({
            sections: [{
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
                      bold: true,
                      size: 32
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cvData.personalInfo.title || '',
                      size: 24
                    })
                  ]
                })
              ]
            }]
          });
          const buffer = await Packer.toBuffer(doc);
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.docx`;
          link.click();
          window.URL.revokeObjectURL(url);
          setGenerationSuccess('CV exporté en Word');
          return { success: true, fileName: link.download };
        case 'html':
          const preview = await generatePreview(cvData, templateId);
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>CV - ${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}</title>
              <style>${preview.css}</style>
            </head>
            <body>
              ${preview.html}
            </body>
            </html>
          `;
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          const htmlUrl = window.URL.createObjectURL(htmlBlob);
          const htmlLink = document.createElement('a');
          htmlLink.href = htmlUrl;
          htmlLink.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.html`;
          htmlLink.click();
          window.URL.revokeObjectURL(htmlUrl);
          setGenerationSuccess('CV exporté en HTML');
          return { success: true, fileName: htmlLink.download };
        case 'json':
          const jsonData = {
            cv: cvData,
            template: templateId,
            exportDate: new Date().toISOString(),
            version: '1.0'
          };
          const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          const jsonUrl = window.URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.json`;
          jsonLink.click();
          window.URL.revokeObjectURL(jsonUrl);
          setGenerationSuccess('CV exporté en JSON');
          return { success: true, fileName: jsonLink.download };
        default:
          throw new Error('Format non supporté');
      }
    } catch (error) {
      setGenerationError(`Erreur lors de l'export ${format}`);
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  }, [generatePDF, generatePreview]);

  // Calculer le score ATS amélioré
  const calculateATSScore = useCallback((cvData, templateId) => {
    let score = 0;
    let feedback = [];
    let recommendations = [];
    if (cvData.personalInfo.firstName && cvData.personalInfo.lastName) {
      score += 10;
    } else {
      feedback.push('Nom et prénom requis');
    }
    if (cvData.personalInfo.email) {
      score += 10;
    } else {
      feedback.push('Email requis');
    }
    if (cvData.personalInfo.phone) {
      score += 10;
    } else {
      feedback.push('Téléphone recommandé');
    }
    if (cvData.summary && cvData.summary.length > 50) {
      score += 15;
    } else {
      feedback.push('Résumé professionnel requis (min 50 caractères)');
      recommendations.push('Ajoutez un résumé professionnel détaillé');
    }
    if (cvData.experience && cvData.experience.length > 0) {
      score += 15;
      if (cvData.experience.length >= 2) score += 5;
    } else {
      feedback.push('Expérience professionnelle requise');
      recommendations.push('Ajoutez vos expériences professionnelles');
    }
    if (cvData.education && cvData.education.length > 0) {
      score += 5;
    } else {
      feedback.push('Formation recommandée');
    }
    if (cvData.skills && cvData.skills.length > 0) {
      score += 10;
      if (cvData.skills.length >= 5) score += 5;
      if (cvData.skills.some(s => s.highlighted)) score += 5;
    } else {
      feedback.push('Compétences requises');
      recommendations.push('Listez vos compétences principales');
    }
    const hasProjects = cvData.projects && cvData.projects.length > 0;
    const hasLanguages = cvData.languages && cvData.languages.length > 0;
    const hasCertifications = cvData.certifications && cvData.certifications.length > 0;
    if (hasProjects || hasLanguages || hasCertifications) {
      score += 10;
    } else {
      recommendations.push('Ajoutez des projets, langues ou certifications');
    }
    if (score < 70) {
      recommendations.push('Optimisez votre CV pour les systèmes ATS');
    }
    if (cvData.summary && cvData.summary.length < 100) {
      recommendations.push('Développez votre résumé professionnel');
    }
    if (!cvData.experience?.some(exp => exp.achievements?.length > 0)) {
      recommendations.push('Ajoutez des réalisations concrètes à vos expériences');
    }
    return {
      score: Math.min(100, score),
      feedback,
      recommendations: recommendations.slice(0, 5),
      details: {
        personalInfo: score >= 30 ? 'Complet' : 'Incomplet',
        content: score >= 50 ? 'Bon' : 'À améliorer',
        skills: score >= 70 ? 'Optimisé' : 'Basique',
        structure: score >= 80 ? 'Excellent' : 'Standard'
      }
    };
  }, []);

  // Fonctions utilitaires
  const countWords = (cvData) => {
    let count = 0;
    Object.values(cvData).forEach(value => {
      if (typeof value === 'string') {
        count += value.split(' ').length;
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'string') {
            count += item.split(' ').length;
          } else if (item && typeof item === 'object') {
            Object.values(item).forEach(v => {
              if (typeof v === 'string') {
                count += v.split(' ').length;
              }
            });
          }
        });
      }
    });
    return count;
  };

  const getTemplateStyles = (templateId) => {
    const styles = {
      modern: {
        css: `
          .cv-modern { font-family: 'Segoe UI', sans-serif; }
          .cv-modern .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        `
      },
      classic: {
        css: `
          .cv-classic { font-family: 'Times New Roman', serif; }
          .cv-classic .header { text-align: center; border-bottom: 2px solid #333; }
        `
      },
    };
    return styles[templateId] || styles.modern;
  };

  const generateHTML = (cvData, template) => {
    return `
      <div class="cv-${template.id}">
        <div class="header">
          <h1>${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}</h1>
          <p>${cvData.personalInfo.title || ''}</p>
        </div>
        <div class="content">
          <p>${cvData.summary || ''}</p>
        </div>
      </div>
    `;
  };

  return {
    isGenerating,
    generationError,
    generationSuccess,
    generationProgress,
    generatePDF,
    generatePreview,
    saveCV,
    shareCV,
    exportCV,
    calculateATSScore,
    setGenerationError,
    setGenerationSuccess
  };
};
