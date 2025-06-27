import React from 'react';

const TemplateGrid = ({ children }) => {
  return (
    <div
      className="cv-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        width: '100%',
        padding: '20px',
      }}
    >
      {children}
    </div>
  );
};

export default TemplateGrid; 