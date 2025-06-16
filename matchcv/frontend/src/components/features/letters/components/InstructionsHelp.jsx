import React from 'react';
import { Lightbulb, Zap } from 'lucide-react'; // Remplacer Brain par Zap

const InstructionsHelp = ({ 
  examples, 
  onAddInstruction, 
  showHelp, 
  toggleHelp,
  value,
  onChange,
  className = ''
}) => {
  if (!examples) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          <Zap className="h-4 w-4 mr-1 text-purple-600" />
          Instructions pour l'IA *
        </label>
        <button
          type="button"
          onClick={toggleHelp}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center focus:outline-none"
        >
          <Lightbulb className="h-3 w-3 mr-1" />
          {showHelp ? 'Masquer' : 'Aide'}
        </button>
      </div>

      {showHelp && (
        <div className="mb-3 p-4 bg-purple-50 border border-purple-200 rounded-md">
          <h4 className="text-sm font-medium text-purple-800 mb-3">
            Exemples d'instructions par catégorie :
          </h4>
          <div className="space-y-3">
            {examples.map((category, catIndex) => (
              <div key={catIndex}>
                <h5 className="text-xs font-semibold text-purple-700 mb-1">
                  {category.category}
                </h5>
                <div className="grid grid-cols-1 gap-1">
                  {category.instructions.map((instruction, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => onAddInstruction(instruction)}
                      className="text-left text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-100 p-1 rounded transition-colors focus:outline-none focus:bg-purple-100"
                    >
                      + {instruction}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <textarea
        name="aiInstructions"
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        rows="6"
        placeholder="Donnez des instructions spécifiques à l'IA pour personnaliser votre lettre :

Exemples :
• Mets l'accent sur mes 3 ans d'expérience en React
• Adopte un ton dynamique et moderne
• Insiste sur ma capacité d'adaptation
• Évite les formules trop classiques
• Termine par une phrase marquante
• Reste concis, maximum 250 mots"
        required
      />
    </div>
  );
};

export default InstructionsHelp;