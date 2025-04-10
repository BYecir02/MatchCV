import Sidebar from "../../components/sidebar/index";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/authService";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUserProfile(data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!userProfile) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="main-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      
      <div className="content-container">
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
            <img src={userProfile.profile_image} alt="Profile" className="profile-image" />
            <div>
              <h1>{userProfile.full_name}</h1>
              <h2>{userProfile.title}</h2>
            </div>
          </div>
          
          <div className="personal-details">
            <h3>Informations Personnelles</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Date de naissance:</span>
                <span className="detail-value">{userProfile.birth_date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nationalité:</span>
                <span className="detail-value">{userProfile.nationality}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Adresse:</span>
                <span className="detail-value">{userProfile.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Téléphone:</span>
                <span className="detail-value">{userProfile.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userProfile.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">LinkedIn:</span>
                <span className="detail-value">{userProfile.linkedin}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">GitHub:</span>
                <span className="detail-value">{userProfile.github}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Permis:</span>
                <span className="detail-value">{userProfile.driving_license}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ajoutez d'autres sections ici si nécessaire */}
      </div>
    </div>
  );
};

export default Profile;