import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Pas besoin de useHistory/useNavigate ici
import { motion } from "framer-motion";
import "./styles.css";
import { FaHome, FaChartLine, FaFileAlt, FaBriefcase, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { logout } from "../../services/authService"; // Importe logout

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const handleMenuClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout(); // Appelle la fonction asynchrone
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
    { path: "/logout", name: "Déconnexion", icon: <FaSignOutAlt />, onClick: handleLogout },
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
      animate={{ width: isOpen ? "280px" : "80px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <span className="toggle-icon">
          {isOpen ? <FaRegEye /> : <LuEyeClosed />}
        </span>
      </button>
      <div className="sidebar-header">
        <div className="logo">{isOpen ? "MatchCV" : " "}</div>
      </div>
      <div className="sidebar-content">
        <ul className="main-menu">
          {menuItems.map((item) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: menuItems.indexOf(item) * 0.1 }}
            >
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={handleMenuClick}
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
              {item.path === "/logout" ? (
                <button
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={item.onClick}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  <span className="icon">{item.icon}</span>
                  {isOpen && <motion.span className="text">{item.name}</motion.span>}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={handleMenuClick}
                >
                  <span className="icon">{item.icon}</span>
                  {isOpen && <motion.span className="text">{item.name}</motion.span>}
                </Link>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;