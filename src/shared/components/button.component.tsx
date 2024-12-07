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
      className={`relative rounded-3xl overflow-hidden border border-slate-700 group ${className}`}
      {...otherProps}
    >
      {!secondary && (
        <div className="bg-slate-950 absolute top-0 left-[-100%] w-full group-hover:translate-x-[100%] h-full -z-10 transition-transform duration-700" />
      )}
      <div
        className={`${
          secondary
            ? " group-hover:bg-slate-700 bg-slate-50 transition-all"
            : "bg-slate-700"
        } absolute top-0 left-0 w-full h-full -z-20`}
      />
      <div
        className={`${
          secondary
            ? "text-slate-700 group-hover:text-slate-50 transition-all"
            : "text-slate-50"
        } z-0 px-10 py-3`}
      >
        {children}
      </div>
    </button>
  );
};

export default Button;
