import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  fullWidth = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-sm font-medium text-text tracking-wide">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 flex items-center text-text-light text-xl pointer-events-none">
            {icon}
          </span>
        )}
        
        <input
          className={`input ${icon ? 'pl-12' : ''} ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <span className="text-sm text-error -mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;