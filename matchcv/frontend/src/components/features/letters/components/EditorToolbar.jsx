import React from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, Link, X 
} from 'lucide-react';
// ...existing code...
// Supprimer l'import de "Palette" qui n'existe pas

const EditorToolbar = ({ 
  onBold, 
  onItalic, 
  onUnderline, 
  onAlign, 
  onList, 
  onInsertLink, 
  onRemoveFormat, 
  textAlign, 
  fontSize, 
  textColor, 
  onFontSizeChange, 
  onColorChange,
  className = ''
}) => {
  return (
    <div className={`mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Formatage de texte */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            onClick={onBold} 
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
            title="Gras"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button 
            onClick={onItalic} 
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
            title="Italique"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button 
            onClick={onUnderline} 
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
            title="Souligné"
            type="button"
          >
            <Underline className="h-4 w-4" />
          </button>
        </div>

        {/* Alignement */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          {[
            { align: 'left', icon: AlignLeft, title: 'Aligner à gauche' },
            { align: 'center', icon: AlignCenter, title: 'Centrer' },
            { align: 'right', icon: AlignRight, title: 'Aligner à droite' }
          ].map(({ align, icon: Icon, title }) => (
            <button
              key={align}
              onClick={() => onAlign(align)}
              className={`p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none ${
                textAlign === align ? 'bg-blue-100' : ''
              }`}
              title={title}
              type="button"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Listes */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            onClick={() => onList(false)} 
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
            title="Liste à puces"
            type="button"
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onList(true)} 
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
            title="Liste numérotée"
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        {/* Autres outils */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button 
            onClick={onInsertLink} 
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
            title="Insérer un lien"
            type="button"
          >
            <Link className="h-4 w-4" />
          </button>
          <button 
            onClick={onRemoveFormat} 
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
            title="Supprimer le formatage"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Taille et couleur */}
        <div className="flex items-center gap-1">
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Taille de police"
          >
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
          </select>
          
          <input
            type="color"
            value={textColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-500"
            title="Couleur du texte"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;