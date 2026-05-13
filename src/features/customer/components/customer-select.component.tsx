import { useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CustomerSelectModal } from "./customer-select-modal.component";
import { Control, Controller } from "react-hook-form";
import { useGetCustomer } from "../hooks/use-get-customer.hook";
import { DotBounceLoading } from "@shared/components/dot-bounce-loading.component";

interface CustomerSelectControllerProps {
  control: Control<any>;
  name: string;
  className?: string;
}

export const CustomerSelectControlled = ({
  control,
  name,
  className,
}: CustomerSelectControllerProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <CustomerSelect
          className={className}
          value={field.value}
          onChange={field.onChange}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};

interface CustomerSelectProps {
  value: string;
  onChange: (customer: string) => void;
  helperText?: string;
  error?: boolean;
  className?: string;
}
export const CustomerSelect = ({
  value,
  onChange,
  error,
  helperText,
  className,
}: CustomerSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const customer = useGetCustomer(value);

  const floated = !!(customer.data || customer.isLoading);

  return (
    <>
      <div className={(className || "") + " relative"}>
        <div
          className={`relative h-14 px-3.5 flex items-center bg-transparent dark:bg-gray-800 border border-black/[0.23] dark:border-white/[0.23] dark:text-white rounded-lg cursor-pointer hover:border-black dark:hover:border-white ${
            error ? "border-red-500 dark:border-red-500" : ""
          }`}
          onClick={() => setIsOpen(true)}
        >
          <span
            className={`pointer-events-none absolute z-10 transition-all dark:text-white/70 text-black/60 ${
              floated
                ? "top-0 left-2 -translate-y-1/2 text-xs px-1 bg-white dark:bg-gray-800"
                : "left-3 top-1/2 -translate-y-1/2 text-base"
            } ${error ? "text-red-500" : ""}`}
          >
            Customer
          </span>

          <div className="flex-1 min-w-0 pr-8">
            {customer.isLoading ? (
              <DotBounceLoading className="py-[9px]" size="w-1" />
            ) : customer.data ? (
              <div className="truncate font-medium text-gray-900 dark:text-gray-50">
                {customer.data.name}
              </div>
            ) : null}
          </div>

          <MdOutlineArrowDropDown className="text-2xl text-dark/55 dark:text-white absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      {error && helperText && (
        <p className="text-red-600 text-sm mt-1">{helperText}</p>
      )}
      {isOpen && (
        <CustomerSelectModal
          close={() => setIsOpen(false)}
          onCustomerSelect={(customer) => onChange(customer._id)}
        />
      )}
    </>
  );
};
