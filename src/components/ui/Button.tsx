"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline'; // Added variant for future flexibility
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const baseStyles = "py-3 px-8 rounded transition-all hover:cursor-pointer font-semibold";
  
  let variantStyles = "";
  switch (variant) {
    case 'secondary':
      // Define secondary styles here if needed in the future
      variantStyles = "bg-gray-500 text-white hover:bg-gray-600"; 
      break;
    case 'outline':
      // Define outline styles here if needed in the future
      variantStyles = "border border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white";
      break;
    case 'primary':
    default:
      variantStyles = "bg-[#800000] text-white hover:bg-[#000000]";
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className || ''}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
