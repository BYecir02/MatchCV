import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CreateCv from "./components/CreateCv/CreateCv";
import Profile from "./components/Profile";
import CvTemplate from "./components/cv-templates/template1/index";
import EditProfile from "./components/EditProfile";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Logout from "./pages/auth/logout";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./pages/layout/index";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/" element={<Layout />}>
        {/* Routes avec Sidebar */}
        <Route index element={<Home />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="create-cv" element={<CreateCv />} />
        <Route path="profile" element={<Profile />} />
        <Route path="CvTemplate" element={<CvTemplate />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="logout" element={<Logout />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
