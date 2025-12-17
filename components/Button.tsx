import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  const baseStyles = "px-8 py-3 text-sm font-medium transition-all duration-300 tracking-wide uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // White border, text white, green hover effect
    primary: "bg-black border border-white text-white hover:border-zeith-metal hover:text-zeith-metalHover",
    // Filled white (rarely used per guidelines, but good for heavy CTA)
    secondary: "bg-white text-black border border-white hover:bg-gray-200",
    // Subtle gray border
    outline: "bg-transparent border border-white/20 text-gray-300 hover:border-zeith-metal hover:text-zeith-metalHover"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
