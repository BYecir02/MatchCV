# MatchCV 🎯

**Outil intelligent pour optimiser et suivre votre recherche d'emploi**

MatchCV est une plateforme complète qui utilise l'intelligence artificielle pour analyser vos compétences, matcher des offres d'emploi et générer des lettres de motivation personnalisées.

## 🚀 Fonctionnalités principales

### 📊 **Gestion de profil complète**
- **Profil détaillé** : Informations personnelles, compétences, expériences, formations
- **Projets & réalisations** : Portfolio avec technologies utilisées et liens
- **Certifications & langues** : Suivi de vos qualifications
- **Import CV intelligent** : Extraction automatique des données depuis votre CV
- **Centres d'intérêt** : Profil humain complet

### 🔍 **Analyse d'offres d'emploi IA**
- **Correspondance précise** : Score de compatibilité basé sur votre profil complet
- **Analyse des compétences** : Identification des compétences essentielles vs souhaitées
- **Points forts/faibles** : Recommandations personnalisées pour améliorer votre candidature
- **Historique des analyses** : Suivi de toutes vos analyses d'offres

### ✍️ **Génération de lettres de motivation**
- **IA personnalisée** : Lettres adaptées à chaque offre et votre profil
- **Exemples concrets** : Utilisation de vos vraies expériences et projets
- **Instructions personnalisées** : Contrôlez le ton et le style
- **Sauvegarde et gestion** : Bibliothèque de vos lettres

### 📈 **Tableau de bord intelligent**
- **Statistiques de matching** : Visualisation de vos compatibilités
- **Suivi des candidatures** : Organisez votre recherche d'emploi
- **Recommandations d'amélioration** : Conseils pour optimiser votre profil

## 🛠️ Technologies utilisées

### **Backend (Node.js)**
- **Express.js** - Framework web
- **MongoDB** avec **Mongoose** - Base de données
- **JWT** - Authentification sécurisée
- **Groq AI** - Intelligence artificielle (Llama 3.1)
- **Bcrypt** - Chiffrement des mots de passe
- **Multer** - Upload de fichiers

### **Frontend (React)**
- **React 18** avec **Hooks**
- **Tailwind CSS** - Design moderne et responsive
- **Lucide React** - Icônes élégantes
- **React Router** - Navigation SPA
- **Context API** - Gestion d'état globale

### **IA et Analyse**
- **Groq API** - Modèle Llama 3.1 pour l'analyse intelligente
- **Parsing CV** - Extraction automatique de données
- **Algorithmes de matching** - Correspondance précise profil/offre

## 📁 Structure du projet

```
MatchCV/
├── backend/                    # API Node.js
│   ├── controllers/           # Logique métier
│   │   ├── authController.js  # Authentification
│   │   ├── jobController.js   # Analyses d'offres
│   │   └── profileController.js # Gestion profil
│   ├── models/               # Modèles MongoDB
│   │   ├── User.js          # Utilisateurs
│   │   ├── Experience.js    # Expériences
│   │   ├── Project.js       # Projets
│   │   └── JobAnalysis.js   # Analyses d'emploi
│   ├── services/            # Services externes
│   │   └── groqService.js   # Intelligence artificielle
│   └── routes/              # Routes API
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   │   ├── features/   # Fonctionnalités principales
│   │   │   │   ├── analyzer/    # Analyseur d'offres
│   │   │   │   ├── profile/     # Gestion profil
│   │   │   │   └── dashboard/   # Tableau de bord
│   │   │   └── shared/     # Composants réutilisables
│   │   ├── services/       # Services API
│   │   └── hooks/          # Hooks personnalisés
│   └── public/
└── README.md
```

## 🚀 Installation et démarrage

### **Prérequis**
- Node.js 18+ 
- MongoDB (local ou Atlas)
- Clé API Groq (gratuite sur [groq.com](https://groq.com))

### **1. Clonage du projet**
```bash
git clone https://github.com/votre-username/MatchCV.git
cd MatchCV
```

### **2. Installation Backend**
```bash
cd backend
npm install
```

**Configuration (.env) :**
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/matchcv
# ou MongoDB Atlas : mongodb+srv://username:password@cluster.mongodb.net/matchcv

# JWT Secret
JWT_SECRET=votre_secret_jwt_super_securise

# API Groq (IA)
GROQ_API_KEY=votre_cle_groq_api

# Port
PORT=5000
```

### **3. Installation Frontend**
```bash
cd ../frontend
npm install
```

**Configuration (.env) :**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### **4. Démarrage**

**Backend :**
```bash
cd backend
npm run dev
```

**Frontend (nouveau terminal) :**
```bash
cd frontend
npm start
```

**Accès à l'application :** http://localhost:3000

## 🎯 Guide d'utilisation

### **1. Inscription et connexion**
- Créez votre compte utilisateur
- Connexion sécurisée avec JWT

### **2. Complétez votre profil**
1. **Informations personnelles** - Nom, titre, contact
2. **Expériences professionnelles** - Postes avec descriptions détaillées
3. **Compétences techniques** - Niveaux et années d'expérience
4. **Formations** - Diplômes et établissements
5. **Projets** - Portfolio avec technologies et liens
6. **Langues et certifications** - Qualifications complètes

### **3. Import de CV (optionnel)**
- Collez le contenu de votre CV
- L'IA extrait automatiquement les informations
- Enrichit votre profil sans écraser les données existantes

### **4. Analyse d'offres d'emploi**
1. Collez une offre d'emploi
2. L'IA analyse la correspondance avec votre profil
3. Obtenez un score de compatibilité détaillé
4. Consultez les recommandations personnalisées

### **5. Génération de lettres de motivation**
- Lettres personnalisées basées sur votre profil réel
- Utilisation de vos expériences et projets concrets
- Instructions personnalisables pour le ton

## 🤖 Intelligence Artificielle

### **Modèle utilisé**
- **Llama 3.1 8B** via Groq (ultra-rapide)
- Spécialisé dans l'analyse RH et la correspondance profil/poste

### **Capacités d'analyse**
- **Extraction de CV** : Parsing intelligent de tous formats
- **Matching précis** : Comparaison avec votre profil complet
- **Recommandations** : Conseils personnalisés d'amélioration
- **Génération de contenu** : Lettres professionnelles et engageantes

### **Données analysées**
- ✅ Compétences techniques (niveau, expérience)
- ✅ Expériences professionnelles (durée, réalisations)
- ✅ Projets personnels (technologies, complexité)
- ✅ Formations (diplômes, spécialisations)
- ✅ Certifications (validité, organisme)
- ✅ Langues (niveau de maîtrise)

## 📊 Fonctionnalités avancées

### **Scores de correspondance**
- **Score global** : Pourcentage de match avec l'offre
- **Compétences essentielles** : Taux de couverture des prérequis
- **Recommandations ciblées** : Actions précises à entreprendre

### **Gestion d'historique**
- Sauvegarde de toutes vos analyses
- Suivi des candidatures par statut
- Export des données en PDF

### **Optimisation continue**
- Suggestions d'amélioration du profil
- Identification des compétences manquantes
- Recommandations de formations

## 🔒 Sécurité et confidentialité

- **Chiffrement** : Mots de passe avec bcrypt
- **JWT** : Authentification sécurisée sans session
- **Validation** : Contrôles stricts des données d'entrée
- **Privacy** : Vos données restent privées et ne sont pas partagées

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commitez (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 👨‍💻 Auteur

**Badir** - Développeur Full Stack
- GitHub: [@votre-github](https://github.com/BYecir02)
- LinkedIn: [Votre LinkedIn](https://www.linkedin.com/in/mohamed-yecir-badirou-4b46a2299/)

## 🙏 Remerciements

- [Groq](https://groq.com) pour l'API IA ultra-rapide
- [Tailwind CSS](https://tailwindcss.com) pour le design
- [Lucide](https://lucide.dev) pour les icônes
- La communauté open source pour l'inspiration

---

**⭐ Si ce projet vous aide dans votre recherche d'emploi, n'hésitez pas à lui donner une étoile !**

## 🚀 Roadmap

### **Version 2.0 (À venir)**
- [ ] **Analyse LinkedIn** - Import automatique depuis LinkedIn
- [ ] **Recommandations d'offres** - Suggestions basées sur votre profil
- [ ] **Suivi de candidatures** - CRM intégré pour candidatures
- [ ] **Templates CV** - Génération de CV optimisés
- [ ] **Intégrations** - Indeed, Glassdoor, etc.
- [ ] **Mode équipe** - Fonctionnalités pour recruteurs
- [ ] **App mobile** - Version iOS/Android
- [ ] **Analyses prédictives** - Prédiction de succès de candidature

### **Améliorations techniques**
- [ ] **Tests automatisés** - Jest + Testing Library
- [ ] **CI/CD** - GitHub Actions
- [ ] **Monitoring** - Logs et métriques
- [ ] **Performance** - Optimisations et cache
- [ ] **Accessibilité** - Conformité WCAG

---

💡 **Conseil** : Remplissez complètement votre profil pour des analyses plus précises !