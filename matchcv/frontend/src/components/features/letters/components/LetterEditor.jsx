import React from 'react';
import { EDITOR_STYLES } from '../constants/editorConfig';

const LetterEditor = ({
  value,
  onChange,
  isRichEditor,
  editorRef,
  fontSize,
  textColor,
  textAlign,
  spellCheck = true,
  placeholder = "Modifiez votre lettre de motivation...",
  className = ''
}) => {
  const baseStyle = {
    ...EDITOR_STYLES.base,
    fontSize: `${fontSize}px`,
    color: textColor,
    textAlign
  };

  if (isRichEditor) {
    return (
      <div
        ref={editorRef}
        contentEditable
        spellCheck={spellCheck}
        onInput={onChange}
        className={`w-full border-0 rounded-md focus:ring-2 focus:ring-orange-500 outline-none ${className}`}
        style={{
          ...baseStyle,
          ...EDITOR_STYLES.rich
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
    );
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={spellCheck}
      className={`w-full border-0 rounded-md focus:ring-2 focus:ring-orange-500 resize-none ${className}`}
      style={{
        ...baseStyle,
        ...EDITOR_STYLES.simple
      }}
      rows="20"
      placeholder={placeholder}
    />
  );
};

export default LetterEditor;