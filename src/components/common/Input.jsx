import React from 'react';

const Input = ({
  type = 'text',
  label,
  error,
  id,
  name,
  placeholder,
  value = '',
  onChange,
  onBlur,
  disabled = false,
  required = false,
  className = '',
  icon
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${
            error ? 'text-red-500' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2 rounded-md border 
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;