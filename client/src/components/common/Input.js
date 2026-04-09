import React, { useState } from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  options,
  rows,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1f2937',
    border: `1px solid ${error ? '#ef4444' : '#374151'}`,
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    transition: 'all 0.2s'
  };

  const baseInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          style={inputStyles}
          {...props}
        />
      );
    }

    if (type === 'select' && options) {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          style={inputStyles}
          {...props}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (type === 'password') {
      return (
        <div style={{ position: 'relative' }}>
          <input
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ ...inputStyles, paddingRight: '3rem' }}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyles}
        {...props}
      />
    );
  };

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      {baseInput()}
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>
      )}
    </div>
  );
};

export default Input;
