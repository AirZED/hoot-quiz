import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  // Add the onClick prop
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, ...props }) => {
  let buttonClasses = 'py-2 px-4 rounded focus:outline-none';

  if (variant === 'primary') {
    buttonClasses += ' bg-blue-500 text-white';
  } else if (variant === 'secondary') {
    buttonClasses += ' bg-gray-500 text-white';
  } else if (variant === 'outline') {
    buttonClasses += ' border border-blue-500 text-blue-500';
  }

  return (
    <button className={buttonClasses} onClick={onClick} {...props}>
      {props.children}
    </button>
  );
};

export default Button;
