require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
app.use(express.json());

// Configuration pour utiliser Groq (gratuit)
const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});

app.post('/generate-cover-letter', async (req, res) => {
  const { jobDescription, userProfile } = req.body;

  try {
    const prompt = `Vous êtes un assistant qui rédige des lettres de motivation professionnelles en français.
Générez une lettre de motivation concise et adaptée pour le poste suivant :
Description du poste : ${jobDescription}
Profil du candidat : ${userProfile}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Vous êtes un assistant qui rédige des lettres de motivation professionnelles en français." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama3-8b-8192", // Modèle gratuit et rapide
      max_tokens: 500,
      temperature: 0.6
    });

    res.json({ letter: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur Groq:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la génération de la lettre',
      details: error.message 
    });
  }
});

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});