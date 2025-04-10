import Sidebar from "../../components/sidebar/index";
import "./styles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/authService";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    title: "",
    profile_image: "",
    personal_details: {
      birthDate: "",
      nationality: "",
      address: "",
      phone: "",
      email: "",
      linkedIn: "",
      github: "",
      permis: ""
    },
    professional_status: {
      current: "",
      rythme: "",
      availability: "",
      desiredSalary: "",
      mobility: ""
    },
    about_summary: "",
    about_personality: [""],
    about_motivations: [""],
    education: [{
      degree: "",
      institution: "",
      period: "",
      details: [""]
    }],
    experiences: [{
      position: "",
      company: "",
      period: "",
      location: "",
      responsibilities: [""],
      achievements: [""]
    }],
    technical_skills: {
      languages: [{ name: "", level: 0, projects: 0 }],
      frameworks: [{ name: "", level: 0 }],
      tools: [""],
      methodologies: [""]
    },
    projects: [{
      name: "",
      role: "",
      period: "",
      description: "",
      technologies: [""],
      features: [""],
      link: ""
    }],
    languages: [{
      language: "",
      level: "",
      certification: ""
    }],
    interests: [{
      category: "",
      activities: [""]
    }]
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          full_name: data.full_name || "",
          title: data.title || "",
          profile_image: data.profile_image || "",
          personal_details: data.personal_details || profile.personal_details,
          professional_status: data.professional_status || profile.professional_status,
          about_summary: data.about_summary || "",
          about_personality: data.about_personality.length ? data.about_personality : [""],
          about_motivations: data.about_motivations.length ? data.about_motivations : [""],
          education: data.education.length ? data.education : profile.education,
          experiences: data.experiences.length ? data.experiences : profile.experiences,
          technical_skills: data.technical_skills || profile.technical_skills,
          projects: data.projects.length ? data.projects : profile.projects,
          languages: data.languages.length ? data.languages : profile.languages,
          interests: data.interests.length ? data.interests : profile.interests
        });
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

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

  const handleArrayChange = (section, index, field, value) => {
    const newArray = [...profile[section]];
    if (field) {
      newArray[index][field] = value;
    } else {
      newArray[index] = value;
    }
    setProfile(prev => ({ ...prev, [section]: newArray }));
  };

  const addNewItem = (section, template) => {
    setProfile(prev => ({ 
      ...prev, 
      [section]: [...prev[section], template] 
    }));
  };

  const removeItem = (section, index) => {
    setProfile(prev => ({ 
      ...prev, 
      [section]: prev[section].filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      alert("Profil mis à jour avec succès !");
      navigate("/profile");
    } catch (error) {
      alert("Erreur lors de la mise à jour du profil : " + (error.response?.data?.error || "Vérifiez vos données"));
    }
  };

  return (
    <div className="main-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="title">Modifier mon profil</h1>
        <button className="back-button" onClick={() => navigate("/profile")}>
          Retour au profil
        </button>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <section className="form-section">
            <h2>Identité</h2>
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Titre professionnel</label>
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Photo de profil (URL)</label>
              <input
                type="text"
                name="profile_image"
                value={profile.profile_image}
                onChange={handleChange}
              />
            </div>
            <h3>Informations personnelles</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="text"
                  name="personal_details.birthDate"
                  value={profile.personal_details.birthDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nationalité</label>
                <input
                  type="text"
                  name="personal_details.nationality"
                  value={profile.personal_details.nationality}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  name="personal_details.address"
                  value={profile.personal_details.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="text"
                  name="personal_details.phone"
                  value={profile.personal_details.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="personal_details.email"
                  value={profile.personal_details.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  name="personal_details.linkedIn"
                  value={profile.personal_details.linkedIn}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="text"
                  name="personal_details.github"
                  value={profile.personal_details.github}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Permis</label>
                <input
                  type="text"
                  name="personal_details.permis"
                  value={profile.personal_details.permis}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
          <section className="form-section">
            <h2>Situation Professionnelle</h2>
            <div className="form-group">
              <label>Situation actuelle</label>
              <input
                type="text"
                name="professional_status.current"
                value={profile.professional_status.current}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Rythme</label>
              <input
                type="text"
                name="professional_status.rythme"
                value={profile.professional_status.rythme}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Disponibilité</label>
              <input
                type="text"
                name="professional_status.availability"
                value={profile.professional_status.availability}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Salaire souhaité</label>
              <input
                type="text"
                name="professional_status.desiredSalary"
                value={profile.professional_status.desiredSalary}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Mobilité</label>
              <input
                type="text"
                name="professional_status.mobility"
                value={profile.professional_status.mobility}
                onChange={handleChange}
              />
            </div>
          </section>
          <section className="form-section">
            <h2>À Propos</h2>
            <div className="form-group">
              <label>Résumé</label>
              <textarea
                name="about_summary"
                value={profile.about_summary}
                onChange={handleChange}
              />
            </div>
            <h3>Personnalité</h3>
            {profile.about_personality.map((item, index) => (
              <div key={index} className="form-group array-item">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('about_personality', index, null, e.target.value)}
                />
                <button type="button" onClick={() => removeItem('about_personality', index)}>
                  Supprimer
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addNewItem('about_personality', '')}>
              + Ajouter un trait
            </button>
            <h3>Motivations</h3>
            {profile.about_motivations.map((item, index) => (
              <div key={index} className="form-group array-item">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('about_motivations', index, null, e.target.value)}
                />
                <button type="button" onClick={() => removeItem('about_motivations', index)}>
                  Supprimer
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addNewItem('about_motivations', '')}>
              + Ajouter une motivation
            </button>
          </section>
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
                  <div className="form-group">
                    <label>Période</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleArrayChange('education', index, 'period', e.target.value)}
                    />
                  </div>
                </div>
                <h3>Détails</h3>
                {edu.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="form-group array-item">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => {
                        const newDetails = [...edu.details];
                        newDetails[detailIndex] = e.target.value;
                        handleArrayChange('education', index, 'details', newDetails);
                      }}
                    />
                    <button type="button" onClick={() => {
                      const newDetails = edu.details.filter((_, i) => i !== detailIndex);
                      handleArrayChange('education', index, 'details', newDetails);
                    }}>
                      Supprimer
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const newDetails = [...edu.details, ""];
                  handleArrayChange('education', index, 'details', newDetails);
                }}>
                  + Ajouter un détail
                </button>
                <button type="button" onClick={() => removeItem('education', index)}>
                  Supprimer cette formation
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNewItem('education', { degree: "", institution: "", period: "", details: [""] })}
            >
              + Ajouter une formation
            </button>
          </section>
          <section className="form-section">
            <h2>Expériences</h2>
            {profile.experiences.map((exp, index) => (
              <div key={index} className="array-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Poste</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleArrayChange('experiences', index, 'position', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Entreprise</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleArrayChange('experiences', index, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Période</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleArrayChange('experiences', index, 'period', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Lieu</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleArrayChange('experiences', index, 'location', e.target.value)}
                    />
                  </div>
                </div>
                <h3>Responsabilités</h3>
                {exp.responsibilities.map((resp, respIndex) => (
                  <div key={respIndex} className="form-group array-item">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => {
                        const newResp = [...exp.responsibilities];
                        newResp[respIndex] = e.target.value;
                        handleArrayChange('experiences', index, 'responsibilities', newResp);
                      }}
                    />
                    <button type="button" onClick={() => {
                      const newResp = exp.responsibilities.filter((_, i) => i !== respIndex);
                      handleArrayChange('experiences', index, 'responsibilities', newResp);
                    }}>
                      Supprimer
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const newResp = [...exp.responsibilities, ""];
                  handleArrayChange('experiences', index, 'responsibilities', newResp);
                }}>
                  + Ajouter une responsabilité
                </button>
                <button type="button" onClick={() => removeItem('experiences', index)}>
                  Supprimer cette expérience
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNewItem('experiences', { position: "", company: "", period: "", location: "", responsibilities: [""], achievements: [""] })}
            >
              + Ajouter une expérience
            </button>
          </section>
          {/* Ajoute les autres sections (technical_skills, projects, languages, interests) avec la même logique */}
          <button type="submit" className="save-button">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;