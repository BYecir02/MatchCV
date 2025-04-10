import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/index";
import "./styles.css";
import axios from "axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    // Si pas de token, rediriger vers login
    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    // Appeler l'API protégée
    const fetchDashboard = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/dashboard/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMessage(response.data.message);
        setUsername(response.data.username);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token invalide ou blacklisté, rediriger vers login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        } else {
          setMessage("Erreur lors du chargement du dashboard");
        }
      }
    };

    fetchDashboard();
  }, [accessToken]);

  return (
    <div className="main-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="text-3xl font-semibold">Tableau de Bord</h1>
        <p>{message || "Suivez vos candidatures et créez vos CV."}</p>
        {username && <p>Connecté en tant que : {username}</p>}
      </div>
    </div>
  );
};

export default Dashboard;