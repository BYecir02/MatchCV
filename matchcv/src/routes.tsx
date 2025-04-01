import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateCv from "./pages/CreateCv/CreateCv";
import Profile from "./pages/Profile";
import CvTemplate from "./components/cv-templates/template1/index";
import EditProfile from "./pages/EditProfile"; // Importez la page d'édition

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-cv" element={<CreateCv />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/CvTemplate" element={<CvTemplate />} />
      <Route path="/edit-profile" element={<EditProfile />} /> {/* Ajoutez la route pour la page d'édition */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
