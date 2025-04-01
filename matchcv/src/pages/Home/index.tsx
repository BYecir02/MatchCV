import Sidebar from "../../components/sidebar/index";
import "./styles.css";

const Home = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="title">Bienvenue sur MatchCV</h1>
        <p>Optimisez votre recherche d'emploi facilement.</p>
        
        <h2>Pourquoi utiliser MatchCV ?</h2>
        <ul>
          <li>📌 Analyse automatique des offres d'emploi</li>
          <li>🎯 Vérification de la correspondance avec vos compétences</li>
          <li>📄 Génération et exportation de CV et lettres de motivation</li>
          <li>📊 Suivi de l'évolution de vos candidatures</li>
          <li>⏳ Gain de temps et organisation simplifiée</li>
        </ul>
        
        <a href="/dashboard" className="button">
          Accéder au Dashboard
        </a>
      </div>
    </div>
  );
};

export default Home;
