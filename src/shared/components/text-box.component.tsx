import React from "react";

export interface TextBoxType
  extends React.AllHTMLAttributes<HTMLInputElement> {}

const TextBox = ({ label, value, className, ...otherProps }: TextBoxType) => {
  return (
    <div className={`relative ${className}`}>
      <input
        className="text-m dark:bg-gray-800 border border-transparent dark:border-gray-700/60 rounded-lg overflow-hidden px-5 pt-6 w-full outline-none focus:border-slate-500 peer shadow-sm"
        id={otherProps.name}
        value={value}
        {...otherProps}
        type="text"
      />
      {label && (
        <label
          id={otherProps.name}
          className={`absolute left-3 px-2 translate-y-[-50%] transition-all text-gray-400 dark:text-gray-500 peer-focus:top-[15px]  peer-focus:text-xs ${
            value ? "top-[15px]  text-xs" : " top-[50%] text-md"
          }`}
        >
          {label}
          {otherProps.required && <span className="text-red-700 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

export default TextBox;
