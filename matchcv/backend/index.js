require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: '🚀 MatchCV API',
    version: '1.0.0',
    status: 'active'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ API MatchCV fonctionne !',
    timestamp: new Date().toISOString()
  });
});

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cv', require('./routes/cv'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/profile', require('./routes/profile')); 
app.use('/api/applications', require('./routes/applications'));

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne'
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur MatchCV démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});