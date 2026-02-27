import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  showWarningForMaxSelection?: boolean;
}

const CounterInput: React.FC<CounterInputProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  className = "",
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string for user to clear and type
    if (inputValue === "") {
      onChange(0);
      return;
    }

    // Only allow numbers
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      // Clamp value between min and max
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    }
  };

  return (
    <div
      className={`flex gap-0 align-center justify-between border rounded-lg overflow-hidden focus:ring-violet-700 dark:focus:ring-violet-300 focus:ring-2  ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="p-2 pr-1 disabled:opacity-50 text-gray-500 dark:text-gray-400 hover:text-violet-700 hover:dark:bg-violet-700 hover:dark:text-white disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <AiOutlineMinus className="text-md" />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className="w-10 text-center border-0 focus:outline-none bg-transparent dark:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="p-2  pl-1 disabled:opacity-50 text-gray-500 dark:text-gray-400 hover:text-violet-700 hover:dark:bg-violet-700 hover:dark:text-white disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <AiOutlinePlus className="text-md" />
      </button>
    </div>
  );
};

export default CounterInput;
