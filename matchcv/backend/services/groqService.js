const OpenAI = require('openai');

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});

const groqService = {
  // Générer lettre de motivation
  async generateCoverLetter(jobDescription, userProfile, aiInstructions) {
    let prompt = `Vous êtes un assistant qui rédige des lettres de motivation professionnelles en français.
Générez une lettre de motivation concise et adaptée pour le poste suivant :

Description du poste : ${jobDescription}
Profil du candidat : ${userProfile}`;

    if (aiInstructions) {
      prompt += `\n\nInstructions spécifiques : ${aiInstructions}`;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Vous êtes un assistant qui rédige des lettres de motivation professionnelles en français. Rédigez des lettres personnalisées, engageantes et professionnelles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      max_tokens: 800,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  },

  // Analyser annonce d'emploi
  async analyzeJob(jobText) {
    const prompt = `Analysez cette annonce d'emploi et extrayez les informations suivantes au format JSON :
- title: titre du poste
- company: nom de l'entreprise
- skills: liste des compétences requises avec leur niveau (Essentiel/Souhaité/Plus)
- experience: expérience requise
- location: lieu
- contract: type de contrat
- salary: salaire si mentionné

Annonce : ${jobText}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Vous êtes un assistant qui analyse les annonces d'emploi. Répondez uniquement en JSON valide."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      max_tokens: 500,
      temperature: 0.3
    });

    try {
      return JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback si JSON invalide
      return {
        title: "Poste à analyser",
        company: "Entreprise",
        skills: [
          { name: "Compétence 1", level: "Essentiel" },
          { name: "Compétence 2", level: "Souhaité" }
        ],
        experience: "2-3 ans",
        location: "À préciser",
        contract: "CDI",
        salary: "À négocier"
      };
    }
  }
};

module.exports = groqService;