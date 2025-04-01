import Sidebar from "../../components/sidebar/index";
import "./styles.css";

const Home = () => {
  return (
    <div className="dashboard-container full-height">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="title">Bienvenue sur MatchCV</h1>
        <p>Optimisez votre recherche d'emploi facilement.</p>
        <a href="/dashboard" className="button">
          Accéder au Dashboard
        </a>
      </div>
    </div>
  );
};

export default Home;