import React, { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export const FormContainer: React.FC<{
  children: React.ReactNode;
  title: string;
  childClassName?: string;
  titleClassName?: string;
  className?: string;
  /** if true, container can be collapsed by clicking the header */
  collapsible?: boolean;
  /** initial open state when collapsible */
  defaultOpen?: boolean;
}> = ({
  children,
  title,
  childClassName,
  titleClassName,
  className,
  collapsible = false,
  defaultOpen = false,
  ...otherProps
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (collapsible) {
      setOpen((o) => !o);
    }
  };

  return (
    <div
      className={`dark:bg-gray-800 bg-white rounded-xl ${className || ""}`}
      {...otherProps}
    >
      <div
        className={`px-4 py-2 flex items-center justify-between cursor-${
          collapsible ? "pointer" : "default"
        }`}
        onClick={handleToggle}
      >
        <h2
          className={`text-sm dark:text-gray-100 text-gray-900 ${
            titleClassName || ""
          }`}
        >
          {title}
        </h2>
        {collapsible && (
          <button
            className="p-1 focus:outline-none"
            aria-label={open ? "Collapse" : "Expand"}
            type="button"
          >
            {open ? (
              <IoChevronUp className="w-4 h-4" />
            ) : (
              <IoChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {(!collapsible || open) && <hr className=" dark:border-gray-600" />}
      {(!collapsible || open) && (
        <div className={`w-full p-4 ${childClassName || ""}`}>{children}</div>
      )}
    </div>
  );
};
