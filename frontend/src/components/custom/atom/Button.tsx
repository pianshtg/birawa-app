import React from 'react';

interface ButtonProps {
  type: "button" | "submit" | "reset";
  IsDisabled? : boolean,
  onClick?: () => void;
  children: React.ReactNode;
  classname?:string,
}

const Button: React.FC<ButtonProps> = ({ type, onClick, children, IsDisabled,classname }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={IsDisabled}
    className={`bg-primary w-full hover:bg-primary/70 ease-in-out duration-300 text-white font-semibold py-2 px-4 rounded focus:outline-none ${classname}`}
  >
    {children}
  </button>
);

export default Button;
