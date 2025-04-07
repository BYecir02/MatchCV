import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import "./styles.css"; 
import { register } from "../../services/authService";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    setIsLoading(true);
    try {
      const data = await register(formData.username, formData.email, formData.password);
      alert("Inscription réussie !");
      // Rediriger vers login si besoin : window.location.href = '/login';
    } catch (error) {
      alert("Erreur lors de l'inscription : " + (error.response?.data?.detail || "Vérifiez vos informations"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container"> {/* Classe générique */}
      <motion.div 
        className="login-card" // Supprimez le commentaire ici
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header"> {/* Classe générique */}
          <h1 className="login-title">Créer un compte</h1>
          <p className="login-subtitle">Rejoignez notre communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form"> {/* Classe générique */}
          <div className="form-group">
            <label htmlFor="username" className="input-label">
              <FaUser className="input-icon" />
              <span>Nom d'utilisateur</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Votre pseudo"
              required
              value={formData.username}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="input-label">
              <FaEnvelope className="input-icon" />
              <span>Adresse Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="exemple@email.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="input-label">
              <FaLock className="input-icon" />
              <span>Mot de passe</span>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-hints">
              <span className={formData.password.length >= 8 ? "valid" : ""}>8 caractères minimum</span>
              <span className={/[A-Z]/.test(formData.password) ? "valid" : ""}>1 majuscule</span>
              <span className={/\d/.test(formData.password) ? "valid" : ""}>1 chiffre</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="input-label">
              <FaLock className="input-icon" />
              <span>Confirmer le mot de passe</span>
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                aria-label={showConfirmPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && formData.confirmPassword && (
              <div className={`password-match ${formData.password === formData.confirmPassword ? "valid" : "error"}`}>
                {formData.password === formData.confirmPassword ? "Les mots de passe correspondent" : "Les mots de passe ne correspondent pas"}
              </div>
            )}
          </div>

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              <span>J'accepte les <a href="/terms">conditions d'utilisation</a> et la <a href="/privacy">politique de confidentialité</a></span>
            </label>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || formData.password !== formData.confirmPassword}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              "S'inscrire"
            )}
          </motion.button>

          <div className="social-auth">
            <p className="divider">
              <span>Ou s'inscrire avec</span>
            </p>
            <div className="social-buttons">
              <button type="button" className="social-button google">
                <FaGoogle /> Google
              </button>
              <button type="button" className="social-button github">
                <FaGithub /> GitHub
              </button>
            </div>
          </div>

          <p className="signup-link">
            Déjà membre ? <a href="/login">Se connecter</a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;