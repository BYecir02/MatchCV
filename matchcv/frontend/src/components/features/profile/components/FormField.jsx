import React from 'react';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  options = [],
  className = '',
  rows = 3,
  ...props 
}) => {
  const inputClasses = `w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select value={value} onChange={onChange} className={inputClasses} {...props}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea 
            value={value} 
            onChange={onChange} 
            className={inputClasses}
            placeholder={placeholder}
            rows={rows}
            {...props}
          />
        );
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            {...props}
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

export default FormField;