import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Target,
  ArrowRight,
  Star,
  BookOpen,
  Briefcase,
  Award,
  MapPin,
  Clock,
  DollarSign,
  File,
} from 'lucide-react';

import api from '../../../services/api';

const JobAnalyzer = ({ user, onNavigateToLetters, onNavigateToCV }) => {
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileMatch, setProfileMatch] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // ✅ RÉCUPÉRER LE PROFIL UTILISATEUR AU CHARGEMENT
useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await api.getProfile();
      console.log('👤 Réponse API complète:', response);
      
      // ✅ CORRECTION : Extraire profileData de la réponse
      if (response.success && response.profileData) {
        setUserProfile(response.profileData);
        console.log('✅ Profil utilisateur extrait:', {
          skills: response.profileData.skills?.length || 0,
          experience: response.profileData.experience?.length || 0,
          education: response.profileData.education?.length || 0,
          languages: response.profileData.languages?.length || 0,
          projects: response.profileData.projects?.length || 0,
          certifications: response.profileData.certifications?.length || 0,
          interests: response.profileData.interests?.length || 0
        });
      } else {
        console.error('❌ Structure de réponse invalide:', response);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  fetchUserProfile();
}, []);

  // ✅ FONCTION D'ANALYSE AVEC PROFIL UTILISATEUR
  const handleAnalyze = async () => {
    if (!jobText.trim()) return;
    
    setLoading(true);
    setAnalysis(null);
    setProfileMatch(null);
    
    try {
      console.log('🔍 Envoi analyse avec profil utilisateur...');
      console.log('👤 Profil à envoyer:', {
        skills: userProfile?.skills?.length || 0,
        experience: userProfile?.experience?.length || 0
      });
      
      // ✅ ENVOYER LE PROFIL UTILISATEUR COMPLET
      const response = await api.analyzeJob({
        jobText: jobText.trim(),
        saveJob: true,
        jobTitle: "Poste extrait de l'annonce",
        companyName: "Entreprise extraite",
        // ✅ PROFIL UTILISATEUR COMPLET
        userProfile: userProfile ? {
          personalInfo: userProfile.personalInfo || {},
          skills: userProfile.skills || [],
          experience: userProfile.experience || [],
          education: userProfile.education || [],
          languages: userProfile.languages || []
        } : null
      });

      console.log('✅ Réponse backend avec vraies correspondances:', response);

      if (response.success) {
        const backendAnalysis = response.analysis;
        
        // ✅ ADAPTER LES DONNÉES BACKEND au format frontend
        const frontendAnalysis = {
          title: backendAnalysis.title || 'Poste non défini',
          company: backendAnalysis.company || 'Entreprise non définie',
          location: backendAnalysis.location || 'Lieu non spécifié',
          contract: backendAnalysis.contractType || 'CDI',
          experience: backendAnalysis.experienceRequired || 'Non spécifié',
          salary: backendAnalysis.salaryRange || 'Non spécifié',
          description: backendAnalysis.analysisSummary || jobText.substring(0, 200) + '...',
          skills: (backendAnalysis.extractedSkills || []).map(skill => ({
            name: skill.skillName,
            level: skill.importanceLevel === 'essential' ? 'Essentiel' : 
                   skill.importanceLevel === 'desired' ? 'Souhaité' : 'Plus',
            match: skill.userHasSkill || false, // ✅ BASÉ SUR TON VRAI PROFIL
            userHas: skill.userHasSkill || false,
            userLevel: skill.userProficiencyLevel || 0
          }))
        };

        // ✅ CALCULER LA CORRESPONDANCE RÉELLE
        const match = calculateRealProfileMatch(frontendAnalysis, response.stats || {}, userProfile);

        setAnalysis(frontendAnalysis);
        setProfileMatch(match);
        
      } else {
        throw new Error(response.message || 'Erreur d\'analyse');
      }

    } catch (error) {
      console.error('❌ Erreur analyse:', error);
      
      if (error.message.includes('401') || error.message.includes('Token')) {
        alert('Session expirée. Veuillez vous reconnecter.');
      } else if (error.message.includes('fetch')) {
        alert('Erreur de connexion. Vérifiez que le backend est démarré.');
      } else {
        alert('Erreur lors de l\'analyse: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ NOUVELLE FONCTION : Calculer la vraie correspondance avec ton profil
  const calculateRealProfileMatch = (analysis, stats, profile) => {
    // Utiliser les stats du backend si disponibles, sinon calculer
    const totalSkills = stats.totalSkills || analysis.skills.length || 1;
    const matchedSkills = stats.matchingSkills || analysis.skills.filter(s => s.match).length;
    const overallScore = stats.overallScore !== undefined ? stats.overallScore : 
                        Math.round((matchedSkills / totalSkills) * 100);
    
    // Calculer le score des compétences essentielles
    const essentialSkills = analysis.skills.filter(skill => skill.level === 'Essentiel');
    const matchedEssentialSkills = essentialSkills.filter(skill => skill.match);
    const essentialScore = essentialSkills.length > 0 
      ? Math.round((matchedEssentialSkills.length / essentialSkills.length) * 100)
      : 100;

    // ✅ EXTRAIRE LES VRAIS POINTS FORTS ET FAIBLESSES
    const strengths = analysis.skills
      .filter(skill => skill.match && skill.level === 'Essentiel')
      .map(skill => skill.name);

    const weaknesses = analysis.skills
      .filter(skill => !skill.match && skill.level === 'Essentiel')
      .map(skill => skill.name);

    // ✅ GÉNÉRER DES RECOMMANDATIONS BASÉES SUR TON PROFIL
    const recommendations = generateProfileBasedRecommendations(analysis.skills, profile, overallScore);

    return {
      overallScore,
      essentialScore,
      skillsMatch: {
        total: totalSkills,
        matched: matchedSkills,
        missing: totalSkills - matchedSkills
      },
      strengths,
      weaknesses,
      recommendations,
      canApply: essentialScore >= 70 && overallScore >= 60
    };
  };

  // ✅ RECOMMANDATIONS INTELLIGENTES BASÉES SUR TON PROFIL
  const generateProfileBasedRecommendations = (skills, profile, score) => {
    const recommendations = [];
    const missingEssential = skills.filter(skill => !skill.match && skill.level === 'Essentiel');
    const missingDesired = skills.filter(skill => !skill.match && skill.level === 'Souhaité');
    const matchedSkills = skills.filter(skill => skill.match);

    // Recommandations selon le score
    if (score >= 80) {
      recommendations.push({
        type: 'strategy',
        text: '🎯 Excellent profil ! Candidatez avec confiance et mettez en avant vos compétences clés.'
      });
    } else if (score >= 60) {
      recommendations.push({
        type: 'improvement',
        text: '💪 Bon profil ! Insistez sur vos points forts et montrez votre motivation à apprendre.'
      });
    } else if (score >= 30) {
      recommendations.push({
        type: 'critical',
        text: '📚 Profil en développement. Concentrez-vous sur les compétences essentielles manquantes.'
      });
    } else {
      recommendations.push({
        type: 'critical',
        text: '⚠️ Ce poste ne correspond pas encore à votre profil. Développez vos compétences d\'abord.'
      });
    }

    // Recommandations spécifiques
    if (missingEssential.length > 0) {
      recommendations.push({
        type: 'critical',
        text: `🔧 Compétences essentielles à acquérir : ${missingEssential.map(s => s.name).slice(0, 3).join(', ')}`
      });
    }

    if (missingDesired.length > 0 && missingEssential.length === 0) {
      recommendations.push({
        type: 'improvement',
        text: `⭐ Pour un profil optimal : ${missingDesired.map(s => s.name).slice(0, 3).join(', ')}`
      });
    }

    if (matchedSkills.length > 0) {
      recommendations.push({
        type: 'strategy',
        text: `✨ Mettez en avant : ${matchedSkills.slice(0, 3).map(s => s.name).join(', ')}`
      });
    }

    // Recommandation basée sur l'expérience
    if (profile?.experience?.length === 0) {
      recommendations.push({
        type: 'improvement',
        text: '📈 Ajoutez vos expériences professionnelles pour améliorer votre profil.'
      });
    }

    return recommendations;
  };

  const handleGenerateLetter = () => {
    if (analysis && onNavigateToLetters) {
      const jobData = {
        jobDescription: `${analysis.title} chez ${analysis.company}\n\n${analysis.description}`,
        companyName: analysis.company,
        position: analysis.title,
        skills: analysis.skills.map(s => s.name),
        location: analysis.location,
        matchedSkills: analysis.skills.filter(s => s.match).map(s => s.name)
      };
      
      onNavigateToLetters(jobData);
    }
  };

  const handleGenerateCV = () => {
    if (analysis && onNavigateToCV) {
      const jobData = {
        jobDescription: `${analysis.title} chez ${analysis.company}\n\n${analysis.description}`,
        companyName: analysis.company,
        position: analysis.title,
        skills: analysis.skills.map(s => s.name),
        location: analysis.location,
        requirements: analysis.skills.filter(s => s.level === 'Essentiel').map(s => s.name),
        matchedSkills: analysis.skills.filter(s => s.match).map(s => s.name)
      };
      
      onNavigateToCV(jobData);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <Star className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <Target className="h-6 w-6 text-orange-600" />;
    return <AlertCircle className="h-6 w-6 text-red-600" />;
  };

  // ✅ AFFICHAGE DE CHARGEMENT SI PROFIL PAS ENCORE RÉCUPÉRÉ
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-3 text-blue-600" />
        <span className="text-gray-600">Chargement de votre profil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analyse d'annonces</h1>
        <p className="text-white mt-1">Analysez les offres d'emploi et découvrez votre compatibilité</p>
        
        {/* ✅ INDICATEUR DU PROFIL CHARGÉ */}
        <div className="mt-4 p-3 bg-white/10 backdrop-blur-md rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                Profil chargé: {userProfile?.skills?.length || 0} compétences, {userProfile?.experience?.length || 0} expériences
              </span>
            </div>
            {(!userProfile?.skills?.length && !userProfile?.experience?.length) && (
              <div className="flex items-center text-yellow-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Profil incomplet</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone de saisie */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Texte de l'annonce
          </h2>
          
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            className="w-full p-4 text-white  bg-white/10 backdrop-blur-md rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="12"
            placeholder="Collez ici le texte complet de l'annonce d'emploi...
                        Exemple:
                        Développeur React Senior recherché
                        Entreprise: TechCorp
                        Localisation: Paris
                        Compétences: React, Node.js, MongoDB, JavaScript
                        Expérience: 3+ ans
                        Salaire: 45-60k€"
          />
          
          <button
            onClick={handleAnalyze}
            disabled={!jobText.trim() || loading}
            className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Search className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Analyse en cours...' : 'Analyser l\'annonce'}
          </button>
        </div>

        {/* Résultats d'analyse */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
            Résultats d'analyse
          </h2>
          
          {analysis ? (
            <div className="space-y-6">
              {/* Informations du poste */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Informations du poste
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">Titre:</span> 
                    <span className="text-gray-700">{analysis.title}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">Entreprise:</span> 
                    <span className="text-gray-700">{analysis.company}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="font-medium w-20 flex-shrink-0">Expérience:</span> 
                    <span className="text-gray-700">{analysis.experience}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="font-medium w-20 flex-shrink-0">Lieu:</span> 
                    <span className="text-gray-700">{analysis.location}</span>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="font-medium w-20 flex-shrink-0">Salaire:</span> 
                    <span className="text-gray-700">{analysis.salary}</span>
                  </div>
                </div>
              </div>

              {/* Compétences détaillées */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Compétences requises ({analysis.skills.length})
                </h3>
                <div className="space-y-2">
                  {analysis.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        {skill.match ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">{skill.name}</span>
                        {skill.userLevel > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Niveau {skill.userLevel}/5)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          skill.level === 'Essentiel' 
                            ? 'bg-red-100 text-red-800' 
                            : skill.level === 'Souhaité'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {skill.level}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          skill.userHas 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {skill.userHas ? '✓ Acquise' : '✗ Manquante'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {analysis.skills.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>Aucune compétence spécifique détectée dans l'annonce</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">L'analyse apparaîtra ici après soumission</p>
              <p className="text-sm text-gray-400">Collez une annonce et cliquez sur "Analyser"</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ SECTION DE CORRESPONDANCE BASÉE SUR TON VRAI PROFIL */}
      {profileMatch && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <User className="h-6 w-6 mr-2 text-purple-600" />
            Correspondance avec votre profil
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Score global */}
            <div className={`p-4 rounded-lg border-2 ${getScoreColor(profileMatch.overallScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score global</span>
                {getScoreIcon(profileMatch.overallScore)}
              </div>
              <div className="text-2xl font-bold">{profileMatch.overallScore}%</div>
              <p className="text-xs mt-1">
                {profileMatch.skillsMatch.matched}/{profileMatch.skillsMatch.total} compétences matchées
              </p>
            </div>

            {/* Score essentiel */}
            <div className={`p-4 rounded-lg border-2 ${getScoreColor(profileMatch.essentialScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Compétences essentielles</span>
                <Target className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{profileMatch.essentialScore}%</div>
              <p className="text-xs mt-1">
                {analysis.skills.filter(s => s.level === 'Essentiel' && s.match).length}/
                {analysis.skills.filter(s => s.level === 'Essentiel').length} critères requis
              </p>
            </div>

            {/* Recommandation */}
            <div className={`p-4 rounded-lg border-2 ${
              profileMatch.canApply 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recommandation</span>
                {profileMatch.canApply ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="text-lg font-bold">
                {profileMatch.canApply ? 'Candidatez !' : 'Développez-vous'}
              </div>
              <p className="text-xs mt-1">
                {profileMatch.canApply 
                  ? 'Profil compatible avec ce poste' 
                  : 'Travaillez vos compétences manquantes'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points forts RÉELS */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Vos points forts ({profileMatch.strengths.length})
              </h3>
              <div className="space-y-2">
                {profileMatch.strengths.length > 0 ? (
                  profileMatch.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-700">{strength}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-green-700">
                    {userProfile?.skills?.length ? 
                      'Aucune compétence essentielle ne correspond.' : 
                      'Ajoutez des compétences à votre profil pour voir vos points forts.'}
                  </p>
                )}
              </div>
            </div>

            {/* Points à améliorer RÉELS */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                À développer ({profileMatch.weaknesses.length})
              </h3>
              <div className="space-y-2">
                {profileMatch.weaknesses.length > 0 ? (
                  profileMatch.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm text-orange-700">{weakness}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-orange-700">
                    Parfait ! Vous avez toutes les compétences essentielles.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recommandations personnalisées */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Recommandations personnalisées
            </h3>
            <div className="space-y-2">
              {profileMatch.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mr-2 mt-2 ${
                    rec.type === 'critical' ? 'bg-red-500' :
                    rec.type === 'improvement' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm text-blue-700">{rec.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerateLetter}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              Générer une lettre de motivation
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
            
            <button
              onClick={handleGenerateCV}
              className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 flex items-center justify-center transition-colors"
            >
              <File className="h-5 w-5 mr-2" />
              Générer un CV optimisé
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
            
            <button 
              onClick={() => window.location.href = '/profile'}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 flex items-center justify-center transition-colors"
            >
              <User className="h-5 w-5 mr-2" />
              Améliorer mon profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;