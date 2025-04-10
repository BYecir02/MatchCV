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
      birth_date: "",
      nationality: "",
      address: "",
      phone: "",
      email: "",
      linkedin: "",
      github: "",
      driving_license: ""
    },
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
            <div className="form-row form-row-three-columns">
              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="text"
                  name="personal_details.birth_date"
                  value={profile.personal_details.birth_date}
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
                  name="personal_details.linkedin"
                  value={profile.personal_details.linkedin}
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
                  name="personal_details.driving_license"
                  value={profile.personal_details.driving_license}
                  onChange={handleChange}
                />
              </div>
            </div>
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