export const FONT_SIZES = [
  { value: '12', label: '12px' },
  { value: '14', label: '14px' },
  { value: '16', label: '16px' },
  { value: '18', label: '18px' },
  { value: '20', label: '20px' },
  { value: '24', label: '24px' }
];

export const TEXT_COLORS = [
  '#374151', // Gris foncé
  '#1f2937', // Noir
  '#dc2626', // Rouge
  '#2563eb', // Bleu
  '#059669', // Vert
  '#7c3aed'  // Violet
];

export const EDITOR_STYLES = {
  base: {
    fontFamily: '"Arial", "Helvetica", sans-serif',
    lineHeight: '1.6',
    fontSize: '14px'
  },
  rich: {
    minHeight: '400px',
    padding: '24px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '6px',
    outline: 'none'
  },
  simple: {
    resize: 'none',
    padding: '24px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '6px'
  }
};