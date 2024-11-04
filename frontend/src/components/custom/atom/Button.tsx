import React from 'react';

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, children }) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-primary w-full hover:bg-primary ease-in-out duration-150 text-white font-semibold py-2 px-4 rounded focus:outline-none"
  >
    {children}
  </button>
);

export default Button;
