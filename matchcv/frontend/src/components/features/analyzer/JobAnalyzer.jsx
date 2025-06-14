import React, { useState } from 'react';
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
import { analyzeJobDescription } from '../../../services/api';

const JobAnalyzer = ({ user, onNavigateToLetters, onNavigateToCV }) => { // Ajouter onNavigateToCV ici
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileMatch, setProfileMatch] = useState(null);

  // Profil utilisateur simulé (en réalité, récupéré depuis le contexte/API)
  const userProfile = {
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'HTML', 'CSS', 'Express'],
    experience: '3 ans',
    location: 'Paris, France',
    title: 'Développeur Full-Stack',
    strengths: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    weaknesses: ['TypeScript', 'Docker', 'AWS']
  };

  const handleAnalyze = async () => {
    if (!jobText.trim()) return;
    
    setLoading(true);
    
    try {
      // Simulation d'analyse d'annonce
      setTimeout(() => {
        const jobAnalysis = {
          title: 'Développeur Full-Stack React/Node.js',
          company: 'TechCorp Solutions',
          skills: [
            { name: 'React', level: 'Essentiel', match: true, userHas: true },
            { name: 'Node.js', level: 'Essentiel', match: true, userHas: true },
            { name: 'TypeScript', level: 'Souhaité', match: false, userHas: false },
            { name: 'MongoDB', level: 'Essentiel', match: true, userHas: true },
            { name: 'Docker', level: 'Souhaité', match: false, userHas: false },
            { name: 'Git', level: 'Essentiel', match: true, userHas: true },
            { name: 'JavaScript', level: 'Essentiel', match: true, userHas: true },
            { name: 'AWS', level: 'Plus', match: false, userHas: false }
          ],
          experience: '2-4 ans',
          location: 'Paris, France',
          contract: 'CDI',
          salary: '45-55k€',
          description: jobText.substring(0, 200) + '...'
        };

        // Calculer la correspondance
        const totalSkills = jobAnalysis.skills.length;
        const matchedSkills = jobAnalysis.skills.filter(skill => skill.match).length;
        const essentialSkills = jobAnalysis.skills.filter(skill => skill.level === 'Essentiel');
        const matchedEssentialSkills = essentialSkills.filter(skill => skill.match);
        
        const overallScore = Math.round((matchedSkills / totalSkills) * 100);
        const essentialScore = Math.round((matchedEssentialSkills.length / essentialSkills.length) * 100);

        const match = {
          overallScore,
          essentialScore,
          skillsMatch: {
            total: totalSkills,
            matched: matchedSkills,
            missing: totalSkills - matchedSkills
          },
          strengths: jobAnalysis.skills
            .filter(skill => skill.match && skill.level === 'Essentiel')
            .map(skill => skill.name),
          weaknesses: jobAnalysis.skills
            .filter(skill => !skill.match && skill.level === 'Essentiel')
            .map(skill => skill.name),
          recommendations: generateRecommendations(jobAnalysis.skills),
          canApply: essentialScore >= 70
        };

        setAnalysis(jobAnalysis);
        setProfileMatch(match);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
    }
  };

  const generateRecommendations = (skills) => {
    const recommendations = [];
    const missingEssential = skills.filter(skill => !skill.match && skill.level === 'Essentiel');
    const missingDesired = skills.filter(skill => !skill.match && skill.level === 'Souhaité');

    if (missingEssential.length > 0) {
      recommendations.push({
        type: 'critical',
        text: `Compétences essentielles manquantes : ${missingEssential.map(s => s.name).join(', ')}`
      });
    }

    if (missingDesired.length > 0) {
      recommendations.push({
        type: 'improvement',
        text: `Pour un profil optimal, apprenez : ${missingDesired.map(s => s.name).join(', ')}`
      });
    }

    recommendations.push({
      type: 'strategy',
      text: 'Mettez en avant vos points forts dans votre lettre de motivation'
    });

    return recommendations;
  };

  const handleGenerateLetter = () => {
    if (analysis && onNavigateToLetters) {
      // Préparer les données pour la page de lettres
      const jobData = {
        jobDescription: `${analysis.title} chez ${analysis.company}\n\n${analysis.description}`,
        companyName: analysis.company,
        position: analysis.title,
        skills: analysis.skills.map(s => s.name),
        location: analysis.location
      };
      
      // Naviguer vers la page de lettres avec les données
      onNavigateToLetters(jobData);
    }
  };

  const handleGenerateCV = () => {
    if (analysis && onNavigateToCV) {
      // Préparer les données pour le générateur de CV
      const jobData = {
        jobDescription: `${analysis.title} chez ${analysis.company}\n\n${analysis.description}`,
        companyName: analysis.company,
        position: analysis.title,
        skills: analysis.skills.map(s => s.name),
        location: analysis.location,
        requirements: analysis.skills.filter(s => s.level === 'Essentiel').map(s => s.name)
      };
      
      // Naviguer vers le générateur de CV avec les données
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analyse d'annonces</h1>
        <p className="text-gray-600 mt-1">Analysez les offres d'emploi et découvrez votre compatibilité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone de saisie */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Texte de l'annonce
          </h2>
          
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="12"
            placeholder="Collez ici le texte complet de l'annonce d'emploi..."
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
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
                  <div className="flex items-center">
                    <span className="font-medium w-20">Titre:</span> 
                    <span>{analysis.title}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-20">Entreprise:</span> 
                    <span>{analysis.company}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="font-medium w-20">Expérience:</span> 
                    <span>{analysis.experience}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="font-medium w-20">Lieu:</span> 
                    <span>{analysis.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium w-20">Salaire:</span> 
                    <span>{analysis.salary}</span>
                  </div>
                </div>
              </div>

              {/* Compétences détaillées */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Compétences requises
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
                          {skill.userHas ? 'Acquise' : 'Manquante'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">L'analyse apparaîtra ici après soumission</p>
            </div>
          )}
        </div>
      </div>

      {/* Section de correspondance avec le profil */}
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
                {profileMatch.skillsMatch.matched}/{profileMatch.skillsMatch.total} compétences
              </p>
            </div>

            {/* Score essentiel */}
            <div className={`p-4 rounded-lg border-2 ${getScoreColor(profileMatch.essentialScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Compétences essentielles</span>
                <Target className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{profileMatch.essentialScore}%</div>
              <p className="text-xs mt-1">Critères obligatoires</p>
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
                {profileMatch.canApply ? 'Candidatez !' : 'Perfectionnez-vous'}
              </div>
              <p className="text-xs mt-1">
                {profileMatch.canApply 
                  ? 'Excellent profil pour ce poste' 
                  : 'Améliorez vos compétences'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points forts */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Vos points forts
              </h3>
              <div className="space-y-2">
                {profileMatch.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Points à améliorer */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                À développer
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
                  <p className="text-sm text-orange-700">Excellent ! Aucune compétence essentielle manquante.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommandations */}
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
            
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 flex items-center justify-center transition-colors">
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