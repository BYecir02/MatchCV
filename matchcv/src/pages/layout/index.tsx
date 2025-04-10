import Sidebar from "../../components/sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "280px", padding: "20px", flex: 1 }}>
        <Outlet /> {/* Contenu des pages enfants */}
      </div>
    </div>
  );
};

export default Layout;
