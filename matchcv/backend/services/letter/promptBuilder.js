const promptBuilder = {
  buildLetterPrompt(jobDescription, profileSummary, aiInstructions) {
    return `GÉNÈRE UNE LETTRE DE MOTIVATION PROFESSIONNELLE:

POSTE:
${jobDescription}

PROFIL CANDIDAT:
${profileSummary}

${aiInstructions ? `INSTRUCTIONS SPÉCIALES: ${aiInstructions}` : ''}

RÈGLES STRICTES:
1. Respecte ABSOLUMENT les instructions utilisateur (si fournies)
2. Utilise UNIQUEMENT les vraies données du profil candidat
3. Adapte le contenu au secteur du poste
4. Structure: Introduction accrocheuse + Compétences/Expériences + Motivation entreprise + Conclusion
5. Longueur: 300-400 mots
6. Ton: Professionnel mais naturel

INTERDICTIONS:
- Ne pas inventer de données
- Éviter les formules banales ("Je me permets de...", "Suite à votre annonce...")
- Ne pas mentionner ce qui est interdit par l'utilisateur

EXEMPLE D'INTRODUCTION ACCROCHEUSE:
✅ "Passionné par l'innovation retail, je suis enthousiasmé par l'opportunité de rejoindre [Entreprise]..."
❌ "Je me permets de vous adresser ma candidature..."

Lettre de motivation:`;
  }
};

module.exports = promptBuilder; 