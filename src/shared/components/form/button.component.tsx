import React from "react";

interface ButtonType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  className = "",
  secondary = false,
  disabled = false,
  isLoading = false,
  ...otherProps
}: ButtonType) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`btn relative inline-flex items-center justify-center gap-2 ${
        isDisabled
          ? secondary
            ? "border-gray-200 dark:text-gray-700 dark:border-gray-700 text-gray-400"
            : "bg-gray-200 text-gray-500 dark:bg-gray-800/60 dark:text-gray-700"
          : secondary
            ? "border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-300 hover:border-gray-900 dark:border-gray-300 hover:dark:border-white"
            : "bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
      } ${className}`}
      {...otherProps}
    >
      {isLoading && <Spinner />}

      <span className={isLoading ? "opacity-70" : ""}>{children}</span>
    </button>
  );
};

export default Button;

const Spinner = () => (
  <span
    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    aria-hidden="true"
  />
);
