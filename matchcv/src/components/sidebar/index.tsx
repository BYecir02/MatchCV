import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import "./styles.css";
import { FaHome, FaChartLine, FaFileAlt, FaBriefcase, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FiAlignJustify } from "react-icons/fi"; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const handleMenuClick = () => {
    if (!isOpen) {
      setIsOpen(true); 
    }
  };

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
    <motion.div
      className="sidebar"
      animate={{ width: isOpen ? "280px" : "80px" }} // Animation de largeur
      transition={{ duration: 0.3, ease: "easeInOut" }} // Durée et easing
    >
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiAlignJustify /> : ">"}
      </button>
      <div className="sidebar-header">
        <div className="logo">{isOpen ? "MatchCV" : "MC"}</div>
      </div>
      <div className="sidebar-content">
        <ul className="main-menu">
          {menuItems.map((item) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.2, delay: menuItems.indexOf(item) * 0.1 }} // Délai pour chaque élément
            >
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={handleMenuClick} // Gère l'ouverture si nécessaire
              >
                <span className="icon">{item.icon}</span>
                {isOpen && <motion.span className="text">{item.name}</motion.span>}
              </Link>
            </motion.li>
          ))}
        </ul>
        <ul className="bottom-menu">
          {bottomMenuItems.map((item) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: bottomMenuItems.indexOf(item) * 0.1 }}
            >
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={handleMenuClick} // Gère l'ouverture si nécessaire
              >
                <span className="icon">{item.icon}</span>
                {isOpen && <motion.span className="text">{item.name}</motion.span>}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;