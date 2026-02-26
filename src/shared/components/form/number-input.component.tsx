import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";

export interface NumberBoxType extends React.AllHTMLAttributes<HTMLInputElement> {
  onNumberChange?: (a: string, b: number) => void;
  control?: Control<any>;
}

const NumberBox = ({
  label,
  value,
  className,
  type = "text",
  onNumberChange,
  control,
  ...otherProps
}: NumberBoxType) => {
  const [error, setError] = useState("");

  const handleChange = (name: string, inputValue: string) => {
    if (!onNumberChange) return;
    const isValid = /^\d*\.?\d*$/.test(inputValue);
    if (isValid || inputValue === "") {
      onNumberChange(name, Number(inputValue));
      setError("");
    } else {
      setError("Enter number only.");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // If a react-hook-form control is provided, render the controlled TextField
  if (control && otherProps.name) {
    return (
      <div className={className}>
        <TextFieldControlled
          name={otherProps.name as string}
          control={control}
          label={label}
          type={type}
          onChange={(e: any) => handleChange(e.target.name, e.target.value)}
          required={otherProps.required}
          className="w-full"
        />
        {error && (
          <span className="absolute bottom-[-25px] left-0 text-sm">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        className="text-m dark:bg-gray-800 border border-transparent dark:border-gray-700/60 rounded-lg overflow-hidden px-5 pt-6 w-full outline-none focus:border-slate-500 peer shadow-sm"
        id={otherProps.name}
        value={value}
        {...otherProps}
        type={type}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      {label && (
        <label
          id={otherProps.name}
          className={`absolute left-3 px-2 translate-y-[-50%] transition-all text-gray-400 dark:text-gray-500 peer-focus:top-[15px]  peer-focus:text-xs ${
            typeof value === "number"
              ? "top-[15px]  text-xs"
              : " top-[50%] text-md"
          }`}
        >
          {label}
          {otherProps.required && <span className="text-red-700 ml-1">*</span>}
        </label>
      )}
      {error && (
        <span className="absolute bottom-[-25px] left-0 text-sm">{error}</span>
      )}
    </div>
  );
};

export default NumberBox;
