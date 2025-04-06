import Sidebar from "../../components/sidebar/index";
import "./styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate(); // Hook pour la navigation
  const [profile, setProfile] = useState({
    // 1. Identité
    identity: {
      fullName: "",
      title: "",
      profileImage: "",
      personalDetails: {
        birthDate: "",
        nationality: "",
        address: "",
        phone: "",
        email: "",
        linkedIn: "",
        github: "",
        permis: ""
      }
    },
    
    // 2. Situation professionnelle
    professionalStatus: {
      current: "",
      rythme: "",
      availability: "",
      desiredSalary: "",
      mobility: ""
    },
    
    // 3. À propos
    about: {
      summary: "",
      personality: [""],
      motivations: [""]
    },
    
    // 4. Formation
    education: [{
      degree: "",
      institution: "",
      period: "",
      details: [""]
    }],
    
    // 5. Expériences
    experiences: [{
      position: "",
      company: "",
      period: "",
      location: "",
      responsibilities: [""],
      achievements: [""]
    }],
    
    // 6. Compétences
    technicalSkills: {
      languages: [{ name: "", level: 0, projects: 0 }],
      frameworks: [{ name: "", level: 0 }],
      tools: [""],
      methodologies: [""]
    },
    
    // 7. Projets
    projects: [{
      name: "",
      role: "",
      period: "",
      description: "",
      technologies: [""],
      features: [""],
      link: ""
    }],
    
    // 8. Langues
    languages: [{
      language: "",
      level: "",
      certification: ""
    }],
    
    // 9. Centres d'intérêt
    interests: [{
      category: "",
      activities: [""]
    }]
  });

  // Gestion des changements pour les champs simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    if (keys.length === 1) {
      setProfile(prev => ({ ...prev, [name]: value }));
    } else if (keys.length === 2) {
      setProfile(prev => ({ 
        ...prev, 
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } 
      }));
    } else if (keys.length === 3) {
      setProfile(prev => ({ 
        ...prev, 
        [keys[0]]: { 
          ...prev[keys[0]], 
          [keys[1]]: { ...prev[keys[0]][keys[1]], [keys[2]]: value } 
        } 
      }));
    }
  };

  // Gestion des tableaux
  const handleArrayChange = (section, index, field, value) => {
    const newArray = [...profile[section]];
    newArray[index][field] = value;
    setProfile(prev => ({ ...prev, [section]: newArray }));
  };

  // Ajout d'un nouvel élément à un tableau
  const addNewItem = (section, template) => {
    setProfile(prev => ({ 
      ...prev, 
      [section]: [...prev[section], template] 
    }));
  };

  // Suppression d'un élément d'un tableau
  const removeItem = (section, index) => {
    setProfile(prev => ({ 
      ...prev, 
      [section]: prev[section].filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profil mis à jour:", profile);
    // Ici vous ajouterez la logique pour sauvegarder les données
  };

  return (
    <div className="main-container">
      
      <div className="sidebar-container">
        <Sidebar />
      </div>
      
      <div className="content-container">
        <h1 className="title">Modifier mon profil</h1>
        
        {/* Bouton de retour */}
        <button 
          className="back-button" 
          onClick={() => navigate("/profile")}
        >
          Retour au profil
        </button>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Section Identité */}
          <section className="form-section">
            <h2>Identité</h2>
            
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="identity.fullName"
                value={profile.identity.fullName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Titre professionnel</label>
              <input
                type="text"
                name="identity.title"
                value={profile.identity.title}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Photo de profil (URL)</label>
              <input
                type="text"
                name="identity.profileImage"
                value={profile.identity.profileImage}
                onChange={handleChange}
              />
            </div>
            
            <h3>Informations personnelles</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="text"
                  name="identity.personalDetails.birthDate"
                  value={profile.identity.personalDetails.birthDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Nationalité</label>
                <input
                  type="text"
                  name="identity.personalDetails.nationality"
                  value={profile.identity.personalDetails.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Continuez avec les autres champs d'identité... */}
          </section>
          
          {/* Section Situation Professionnelle */}
          <section className="form-section">
            <h2>Situation Professionnelle</h2>
            
            <div className="form-group">
              <label>Situation actuelle</label>
              <input
                type="text"
                name="professionalStatus.current"
                value={profile.professionalStatus.current}
                onChange={handleChange}
              />
            </div>
            
            {/* Ajoutez les autres champs de situation pro... */}
          </section>
          
          {/* Section À Propos */}
          <section className="form-section">
            <h2>À Propos</h2>
            
            <div className="form-group">
              <label>Résumé</label>
              <textarea
                name="about.summary"
                value={profile.about.summary}
                onChange={handleChange}
              />
            </div>
            
            <h3>Personnalité</h3>
            {profile.about.personality.map((item, index) => (
              <div key={index} className="form-group array-item">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('about.personality', index, null, e.target.value)}
                />
                <button type="button" onClick={() => removeItem('about.personality', index)}>
                  Supprimer
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => addNewItem('about.personality', '')}
            >
              + Ajouter un trait
            </button>
            
            {/* Faites de même pour les motivations... */}
          </section>
          
          {/* Section Formation */}
          <section className="form-section">
            <h2>Formation</h2>
            
            {profile.education.map((edu, index) => (
              <div key={index} className="array-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Diplôme</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Établissement</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Ajoutez les autres champs de formation... */}
                
                <button type="button" onClick={() => removeItem('education', index)}>
                  Supprimer cette formation
                </button>
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={() => addNewItem('education', {
                degree: "",
                institution: "",
                period: "",
                details: [""]
              })}
            >
              + Ajouter une formation
            </button>
          </section>
          
          {/* Continuez avec les autres sections (Expériences, Compétences, Projets, etc.) */}
          
          <button type="submit" className="save-button">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;