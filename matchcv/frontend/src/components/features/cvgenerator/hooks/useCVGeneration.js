import { useState, useCallback } from 'react';

export const useCVGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generationSuccess, setGenerationSuccess] = useState('');

  // Générer le PDF du CV
  const generatePDF = useCallback(async (cvData, templateId, options = {}) => {
    setIsGenerating(true);
    setGenerationError('');
    setGenerationSuccess('');

    try {
      // Simuler la génération PDF
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En production, vous appelleriez votre API ici
      // const response = await fetch('/api/cv/generate-pdf', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ cvData, templateId, options })
      // });

      // Simuler le téléchargement
      const fileName = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_${templateId}.pdf`;
      
      // Créer un blob simulé (en production, ce serait le PDF réel)
      const blob = new Blob(['CV PDF Content'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Déclencher le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setGenerationSuccess(`CV téléchargé avec succès : ${fileName}`);
      
      return { success: true, fileName };
      
    } catch (error) {
      setGenerationError('Erreur lors de la génération du PDF');
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Générer un aperçu HTML
  const generatePreview = useCallback(async (cvData, templateId) => {
    try {
      // En production, générer l'HTML du template
      // const html = renderTemplate(cvData, templateId);
      
      // Simuler la génération d'aperçu
      const preview = {
        html: `<div>Aperçu du CV pour ${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}</div>`,
        templateId,
        timestamp: new Date().toISOString()
      };
      
      return preview;
      
    } catch (error) {
      setGenerationError('Erreur lors de la génération de l\'aperçu');
      return null;
    }
  }, []);

  // Sauvegarder le CV
  const saveCV = useCallback(async (cvData, templateId) => {
    setIsGenerating(true);
    setGenerationError('');
    setGenerationSuccess('');

    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));

      // En production, sauvegarder en base
      // const response = await fetch('/api/cv/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ cvData, templateId })
      // });

      const savedCV = {
        id: Date.now(),
        ...cvData,
        templateId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setGenerationSuccess('CV sauvegardé avec succès');
      return { success: true, cv: savedCV };
      
    } catch (error) {
      setGenerationError('Erreur lors de la sauvegarde');
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Partager le CV
  const shareCV = useCallback(async (cvData, templateId) => {
    try {
      // Générer un lien de partage
      const shareId = `cv-${Date.now()}`;
      const shareUrl = `${window.location.origin}/cv/share/${shareId}`;
      
      // Copier dans le presse-papier
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setGenerationSuccess('Lien de partage copié dans le presse-papier');
      }
      
      return { success: true, shareUrl, shareId };
      
    } catch (error) {
      setGenerationError('Erreur lors de la génération du lien de partage');
      return { success: false, error: error.message };
    }
  }, []);

  // Exporter en différents formats
  const exportCV = useCallback(async (cvData, templateId, format = 'pdf') => {
    setIsGenerating(true);
    setGenerationError('');

    try {
      switch (format.toLowerCase()) {
        case 'pdf':
          return await generatePDF(cvData, templateId);
        
        case 'docx':
          // Simuler export Word
          await new Promise(resolve => setTimeout(resolve, 1500));
          const docxFileName = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.docx`;
          setGenerationSuccess(`CV exporté en Word : ${docxFileName}`);
          return { success: true, fileName: docxFileName };
        
        case 'html':
          // Simuler export HTML
          const htmlContent = `<!DOCTYPE html><html><head><title>CV</title></head><body><h1>${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}</h1></body></html>`;
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          const htmlUrl = window.URL.createObjectURL(htmlBlob);
          const htmlLink = document.createElement('a');
          htmlLink.href = htmlUrl;
          htmlLink.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.html`;
          htmlLink.click();
          window.URL.revokeObjectURL(htmlUrl);
          return { success: true, fileName: htmlLink.download };
        
        default:
          throw new Error('Format non supporté');
      }
    } catch (error) {
      setGenerationError(`Erreur lors de l'export ${format}`);
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  }, [generatePDF]);

  // Calculer le score ATS
  const calculateATSScore = useCallback((cvData, templateId) => {
    let score = 0;
    let feedback = [];

    // Vérifications basiques
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
      feedback.push('Résumé professionnel requis');
    }

    if (cvData.experience && cvData.experience.length > 0) {
      score += 20;
      if (cvData.experience.some(exp => exp.achievements && exp.achievements.length > 0)) {
        score += 10;
      }
    } else {
      feedback.push('Expérience professionnelle requise');
    }

    if (cvData.skills && cvData.skills.length >= 5) {
      score += 15;
    } else {
      feedback.push('Au moins 5 compétences recommandées');
    }

    if (cvData.education && cvData.education.length > 0) {
      score += 10;
    }

    // Bonus pour template ATS-friendly
    const atsTemplates = ['modern', 'classic', 'minimal'];
    if (atsTemplates.includes(templateId)) {
      score += 10;
    }

    return {
      score: Math.min(score, 100),
      feedback,
      recommendations: generateATSRecommendations(score, feedback)
    };
  }, []);

  const generateATSRecommendations = (score, feedback) => {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push('Votre CV nécessite des améliorations importantes pour être optimisé ATS');
    } else if (score < 80) {
      recommendations.push('Bon début ! Quelques améliorations augmenteront vos chances');
    } else {
      recommendations.push('Excellent ! Votre CV est bien optimisé pour les systèmes ATS');
    }

    feedback.forEach(item => {
      recommendations.push(`• ${item}`);
    });

    return recommendations;
  };

  return {
    isGenerating,
    generationError,
    generationSuccess,
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