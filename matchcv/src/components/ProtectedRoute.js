import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) {
      window.location.href = "/login"; // Redirection si pas de token
    }
  }, [accessToken]);

  return accessToken ? children : null; // Ne rend rien si pas de token (redirection gérée par useEffect)
};

export default ProtectedRoute;