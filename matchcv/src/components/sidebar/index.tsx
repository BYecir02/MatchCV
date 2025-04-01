import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";
import { FaHome, FaChartLine, FaFileAlt, FaBriefcase, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/", name: "Accueil", icon: <FaHome /> },
    { path: "/dashboard", name: "Dashboard", icon: <FaChartLine /> },
    { path: "/create-cv", name: "Créer un CV", icon: <FaFileAlt /> },
    { path: "/jobs", name: "Suivi candidatures", icon: <FaBriefcase /> },
  ];

  const bottomMenuItems = [
    { path: "/profile", name: "Profil", icon: <FaUserCircle /> },
    { path: "/settings", name: "Paramètres", icon: <FaCog /> },
    { path: "/logout", name: "Déconnexion", icon: <FaSignOutAlt /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "<" : ">"}
      </button>
      <div className="sidebar-header">
        <div className="logo">{isOpen ? "MatchCV" : ""}</div>
      </div>
      <div className="sidebar-content">
        <ul className="main-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={`nav-link ${location.pathname === item.path ? "active" : ""}`}>
                <span className="icon">{item.icon}</span>
                {isOpen && <span className="text">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="bottom-menu">
          {bottomMenuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={`nav-link ${location.pathname === item.path ? "active" : ""}`}>
                <span className="icon">{item.icon}</span>
                {isOpen && <span className="text">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;