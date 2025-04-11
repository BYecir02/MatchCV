import Sidebar from "../sidebar/index";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, deleteExperience } from "../../services/authService";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUserProfile(data); // Utilise directement les données du backend
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleDeleteExperience = async (experienceId) => {
    try {
      await deleteExperience(experienceId);
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        experiences: prevProfile.experiences.filter(
          (experience) => experience.id !== experienceId
        ),
      }));
      alert("Expérience supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'expérience:", error.response?.data);
      alert("Impossible de supprimer l'expérience : " + (error.response?.data?.error || "Erreur inconnue"));
    }
  };

  if (!userProfile) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="profile">
      {/* Bouton pour modifier le profil */}
      <div className="edit-profile-button-container">
        <button
          className="edit-profile-button"
          onClick={() => navigate("/edit-profile")}
        >
          Modifier / Compléter mon profil
        </button>
      </div>

      {/* Section Identité */}
      <section className="identity-section">
        <div className="identity-header">
          <img
            src={userProfile.profile_image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-image"
          />
          <div>
            <h1>{userProfile.full_name || "Nom non défini"}</h1>
            <h2>{userProfile.title || "Titre non défini"}</h2>
          </div>
        </div>

        <div className="personal-details">
          <h3>Informations Personnelles</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Date de naissance:</span>
              <span className="detail-value">{userProfile.birth_date || "Non renseignée"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Nationalité:</span>
              <span className="detail-value">{userProfile.nationality || "Non renseignée"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Adresse:</span>
              <span className="detail-value">{userProfile.address || "Non renseignée"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Téléphone:</span>
              <span className="detail-value">{userProfile.phone || "Non renseigné"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{userProfile.email || "Non renseigné"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">LinkedIn:</span>
              <span className="detail-value">{userProfile.linkedin || "Non renseigné"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">GitHub:</span>
              <span className="detail-value">{userProfile.github || "Non renseigné"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Permis:</span>
              <span className="detail-value">{userProfile.driving_license || "Non renseigné"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Expériences Professionnelles */}
      <section className="experience-section">
        <h2>Expériences Professionnelles</h2>
        {userProfile.experiences && userProfile.experiences.length > 0 ? (
          userProfile.experiences.map((experience, index) => (
            <div key={index} className="experience-item">
              <h3>
                {experience.position} - {experience.company}
              </h3>
              <p className="period">
                {experience.period} - {experience.location}
              </p>
              <h4>Responsabilités :</h4>
              <ul>
                {experience.responsibilities && experience.responsibilities.length > 0 ? (
                  experience.responsibilities.map((responsibility, idx) => (
                    <li key={idx}>{responsibility}</li>
                  ))
                ) : (
                  <li>Aucune responsabilité listée</li>
                )}
              </ul>
              <h4>Réalisations :</h4>
              <ul>
                {experience.achievements && experience.achievements.length > 0 ? (
                  experience.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))
                ) : (
                  <li>Aucune réalisation listée</li>
                )}
              </ul>
              <button
                className="delete-experience-button"
                onClick={() => handleDeleteExperience(experience.id)}
              >
                Supprimer
              </button>
            </div>
          ))
        ) : (
          <p>Aucune expérience professionnelle enregistrée.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;