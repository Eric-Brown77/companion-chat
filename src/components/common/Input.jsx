import React from 'react';

const Input = ({
  type = 'text',
  label,
  error,
  id,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  icon
}) => {
  // 基础样式
  const baseInputStyle = `
    w-full px-4 py-2 rounded-md border
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-colors duration-200
  `;

  // 状态样式
  const stateStyles = {
    normal: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed'
  };

  // 获取当前状态的样式
  const currentState = disabled ? 'disabled' : error ? 'error' : 'normal';

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
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            ${baseInputStyle}
            ${stateStyles[currentState]}
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