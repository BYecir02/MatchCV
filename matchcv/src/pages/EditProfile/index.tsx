import Sidebar from "../../components/sidebar/index";
import "./styles.css";

const EditProfile = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="title">Modifier / Compléter mon profil</h1>
        <form className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="fullName">Nom complet</label>
            <input type="text" id="fullName" name="fullName" placeholder="Entrez votre nom complet" />
          </div>
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input type="text" id="title" name="title" placeholder="Entrez votre titre professionnel" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Entrez votre email" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input type="tel" id="phone" name="phone" placeholder="Entrez votre numéro de téléphone" />
          </div>
          <button type="submit" className="save-button">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
