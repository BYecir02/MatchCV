import { useState } from 'react';
import { generateCoverLetter } from '../../../../services/api';
import { validateFormData } from '../utils/letterUtils';

export const useLetterGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');

  const handleGenerate = async (formData) => {
    // Validation
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return null;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await generateCoverLetter(
        formData.jobDescription, 
        formData.aiInstructions,
        {
          companyName: formData.companyName,
          position: formData.position
        }
      );
      
      setGeneratedLetter(response.letter);
      setSuccess('Lettre de motivation générée avec succès !');
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccess(''), 3000);
      
      return response.letter;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération de la lettre';
      setError(errorMessage);
      
      // Masquer le message d'erreur après 5 secondes
      setTimeout(() => setError(''), 5000);
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async (formData) => {
    return await handleGenerate(formData);
  };

  const resetGeneration = () => {
    setGeneratedLetter('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    // États
    loading,
    error,
    success,
    generatedLetter,
    
    // Actions
    handleGenerate,
    regenerate,
    resetGeneration,
    clearMessages,
    
    // Setters pour contrôle manuel
    setError,
    setSuccess
  };
};