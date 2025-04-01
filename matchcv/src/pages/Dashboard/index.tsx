import Sidebar from "../../components/sidebar/index";
import "./styles.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container full-height">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="text-3xl font-semibold">Tableau de Bord</h1>
        <p>Suivez vos candidatures et créez vos CV.</p>
      </div>
    </div>
  );
};

export default Dashboard;