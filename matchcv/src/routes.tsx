import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateCv from "./pages/CreateCv/CreateCv";
import Profile from "./pages/Profile";
import CvTemplate from "./components/cv-templates/template1/index";
import EditProfile from "./pages/EditProfile"; // Importez la page d'édition
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Logout from "./pages/auth/logout";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/create-cv" element={<CreateCv />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/CvTemplate" element={<CvTemplate />} />
      <Route path="/edit-profile" element={<EditProfile />} /> {/* Ajoutez la route pour la page d'édition */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/logout" element={<Logout />} /> {/* Ajoutez la route pour la déconnexion */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
