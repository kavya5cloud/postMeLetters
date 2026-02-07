
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseStyles = "px-6 py-2 rounded-2xl transition-all active:scale-90 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 select-none border-2";
  const variants = {
    primary: "bg-[#F69D8D] text-[#333940] border-[#333940] shadow-[3px_3px_0px_#333940] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
    secondary: "bg-white text-[#333940] border-[#333940] shadow-[3px_3px_0px_#333940] hover:shadow-none",
    ghost: "bg-transparent text-gray-500 border-transparent hover:text-[#F69D8D] hover:bg-white/50"
  };

  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
