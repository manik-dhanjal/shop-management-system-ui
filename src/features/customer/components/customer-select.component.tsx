import { useEffect, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CustomerSelectModal } from "./customer-select-modal.component";
import { Control, Controller } from "react-hook-form";
import { useGetCustomer } from "../hooks/use-get-customer.hook";
import { CustomerPopulated } from "../interface/customer.interface";
import { UseQueryResult } from "@tanstack/react-query";
import { MobileStepper } from "@mui/material";
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

  return (
    <>
      <div className={className + " relative"}>
        <div
          className="p-4 dark:bg-gray-800 border border-black/25 dark:border-white/25 dark:text-white rounded-lg cursor-pointer pr-4 hover:border-black dark:hover:border-white z-0"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex justify-between items-center">
            <div
              className={`text-m dark:text-white/70 text-black/60 dark:bg-gray-800  z-100 transition-all absolute   translate-y-[-50%] ${customer.data || customer.isLoading ? " top-[0] left-1 scale-[85%] bg-white px-[5px]" : "left-3 top-[50%] bg-transparent"}`}
            >
              Customer
            </div>
            <MdOutlineArrowDropDown className="text-2xl text-dark/55 dark:text-white absolute right-2 top-[50%] translate-y-[-50%]" />
          </div>
          {customer.isLoading ? (
            <DotBounceLoading className="py-[9px]" size="w-1" />
          ) : customer.data ? (
            <>
              <div className="font-medium text-gray-900 dark:text-gray-50">
                {customer.data.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {customer.data.phone}
              </div>
            </>
          ) : (
            <div className="text-m opacity-0">Customer</div>
          )}
        </div>
        {error && helperText && (
          <p className="text-red-600 text-sm mt-1">{helperText}</p>
        )}
      </div>
      {isOpen && (
        <CustomerSelectModal
          close={() => setIsOpen(false)}
          onCustomerSelect={(customer) => onChange(customer._id)}
        />
      )}
    </>
  );
};
