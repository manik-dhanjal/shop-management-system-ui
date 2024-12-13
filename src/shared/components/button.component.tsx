import React from "react";

interface ButtonType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
}

const Button = ({
  children,
  className,
  secondary = false,
  ...otherProps
}: ButtonType) => {
  return (
    <button
      className={`btn ${
        secondary
          ? "border-gray-900 dark:text-gray-100 hover:border-gray-800 dark:border-gray-100 text-gray-800 dark:hover:border-white"
          : "bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
      } ${className}`}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
