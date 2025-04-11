import React from 'react';
import './styles.css'; // On va créer un fichier CSS pour le style

const MatchCVInput = () => {
  return (
    <div className="input-container">
      <div className="header">
        <h2>MatchCV - Analyse d'Annonces</h2>
        <p>Collez une annonce ou les critères d'une offre d'emploi ci-dessous :</p>
      </div>
      <div className="input-wrapper">
        <textarea
          placeholder="Collez l'annonce ou les critères ici..."
          className="text-input"
        />
        <button className="submit-button">Analyser</button>
      </div>
    </div>
  );
};

export default MatchCVInput;