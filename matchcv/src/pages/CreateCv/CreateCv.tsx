import Sidebar from "../../components/sidebar/index";

const CreateCv = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="text-3xl font-semibold">Créer un CV</h1>
        <p>Choisissez un modèle et commencez à personnaliser votre CV.</p>
      </div>
    </div>
  );
};

export default CreateCv;
