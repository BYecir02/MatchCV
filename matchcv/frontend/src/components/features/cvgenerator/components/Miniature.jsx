import React from 'react';

const Miniature = ({ template }) => {
  return (
    <div
      className="cv-miniature"
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transform: 'scale(0.95)',
        transition: 'transform 0.3s ease',
        background: '#fff',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <div style={{
        width: '100%',
        aspectRatio: '210/297', // ratio A4
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
      }}>
        <div style={{
          width: '90%',
          height: '90%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {template}
        </div>
      </div>
    </div>
  );
};

export default Miniature; 