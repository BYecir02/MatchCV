import "./styles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, deleteExperience, addExperience as addExperienceAPI, updateExperience } from "../../services/authService";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    title: "",
    profile_image: "",
    birth_date: "",
    nationality: "",
    address: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    driving_license: "",
    experiences: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          full_name: data.full_name || "",
          title: data.title || "",
          profile_image: data.profile_image || "",
          birth_date: data.birth_date || "",
          nationality: data.nationality || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          driving_license: data.driving_license || "",
          experiences: data.experiences || []
        });
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          console.error("Erreur lors du chargement du profil:", error.response?.data);
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = async (index, e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "responsibilities" || name === "achievements") {
        updatedValue = value.split('\n').filter(line => line.trim() !== '');
    }

    setProfile(prev => {
        const updatedExperiences = [...prev.experiences];
        updatedExperiences[index] = { ...updatedExperiences[index], [name]: updatedValue };
        return { ...prev, experiences: updatedExperiences };
    });

    const experience = profile.experiences[index];
    if (experience.id) {
        try {
            await updateExperience(experience.id, { ...experience, [name]: updatedValue });
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error.response?.status, error.response?.data);
            alert("Impossible de modifier l'expérience : " + (error.response?.data?.error || "Erreur inconnue"));
        }
    }
};

  const addExperience = async () => {
    try {
        const newExperience = {
            position: "Test Poste",
            company: "Test Entreprise",
            period: "2023",
            location: "Paris",
            responsibilities: [],
            achievements: []
        };
        console.log("Ajout d'une expérience :", newExperience);
        const addedExperience = await addExperienceAPI(newExperience);
        console.log("Expérience ajoutée :", addedExperience);
        setProfile(prev => ({
            ...prev,
            experiences: [...prev.experiences, addedExperience]
        }));
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error.response?.status, error.response?.data);
        alert("Impossible d'ajouter l'expérience : " + (error.response?.data?.error || "Erreur inconnue"));
    }
};

const removeExperience = async (index) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cette expérience ?")) return;
  const experience = profile.experiences[index];
  console.log("Suppression de l'expérience avec ID :", experience.id);
  if (experience.id && !isNaN(experience.id)) {
      try {
          await deleteExperience(experience.id);
          setProfile(prev => ({
              ...prev,
              experiences: prev.experiences.filter((_, i) => i !== index)
          }));
          console.log("Expérience supprimée avec succès");
      } catch (error) {
          console.error("Erreur lors de la suppression :", error.response?.status, error.response?.data);
          alert("Impossible de supprimer l’expérience : " + errorFriendlyMessage(error));
      }
  } else {
      setProfile(prev => ({
          ...prev,
          experiences: prev.experiences.filter((_, i) => i !== index)
      }));
      console.log("Expérience locale supprimée");
  }
};

  const errorFriendlyMessage = (error) => {
   if (error.response?.status === 404) return "Expérience non trouvée.";
   if (error.response?.status === 401) return "Session expirée, veuillez vous reconnecter.";
   return error.response?.data?.error || "Erreur inconnue.";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      alert("Profil mis à jour avec succès !");
      navigate("/profile");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error.response?.data);
      alert("Erreur lors de la mise à jour du profil : " + (error.response?.data?.error || "Vérifiez vos données"));
    }
  };

  return (
    <div className="editprofile">
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
                type="url"
                name="profile_image"
                value={profile.profile_image}
                onChange={handleChange}
              />
            </div>
            <h3>Informations personnelles</h3>
            <div className="form-row form-row-three-columns">
              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="date"
                  name="birth_date"
                  value={profile.birth_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nationalité</label>
                <input
                  type="text"
                  name="nationality"
                value={profile.nationality}
                onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="text"
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Permis</label>
                <input
                  type="text"
                  name="driving_license"
                  value={profile.driving_license}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Expériences</h2>
            {profile.experiences.map((exp, index) => (
              <div key={index} className="experience-group">
                <div className="form-group">
                  <label>Poste</label>
                  <input
                    type="text"
                    name="position"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Entreprise</label>
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Période</label>
                  <input
                    type="text"
                    name="period"
                    value={exp.period}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input
                    type="text"
                    name="location"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Responsabilités (une par ligne)</label>
                  <textarea
                    name="responsibilities"
                    value={exp.responsibilities.join('\n')}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Réalisations (une par ligne)</label>
                  <textarea
                    name="achievements"
                    value={exp.achievements.join('\n')}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
                <button type="button" onClick={() => removeExperience(index)}>
                  Supprimer cette expérience
                </button>
              </div>
            ))}
            <button type="button" onClick={addExperience}>
              Ajouter une expérience
            </button>
          </section>

          <button type="submit" className="save-button">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;