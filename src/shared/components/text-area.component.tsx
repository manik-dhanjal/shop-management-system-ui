import React from "react";

export interface TextAreaType
  extends React.AllHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = ({ label, value, className, ...otherProps }: TextAreaType) => {
  return (
    <div className={`relative mt-3 ${className}`}>
      <textarea
        className="text-md border dark:bg-gray-800 border-transparent dark:border-gray-700/60 dark:text-gray-400 bg-white rounded-lg overflow-hidden px-5 pt-6 w-full outline-none focus:border-slate-500 peer  h-[150px] shadow-sm"
        id={otherProps.name}
        value={value}
        {...otherProps}
      />
      {label && (
        <label
          id={otherProps.name}
          className={`bg-white dark:bg-gray-800 absolute left-5 translate-y-[-50%] transition-all text-gray-400 dark:text-gray-500 peer-focus:top-[15px] peer-focus:text-xs ${
            value ? "top-[15px]  text-xs" : " top-6 text-md"
          }`}
        >
          {label}
          {otherProps.required && <span className="text-red-700 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

export default TextArea;
