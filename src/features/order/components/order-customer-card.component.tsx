import { Control } from "react-hook-form";
import { CustomerSelectControlled } from "@features/customer/components/customer-select.component";
import { useGetCustomer } from "@features/customer/hooks/use-get-customer.hook";
import { useWatch } from "react-hook-form";

interface CustomerSelectSlotProps {
  control: Control<any>;
}

/**
 * The customer dropdown only. Used inside the Order Details grid alongside the
 * other top-row fields. The thin info chip below is `CustomerInfoChip`.
 */
export const CustomerSelectSlot: React.FC<CustomerSelectSlotProps> = ({
  control,
}) => {
  return <CustomerSelectControlled control={control} name="customer" />;
};

interface CustomerInfoChipProps {
  control: Control<any>;
  shopState?: string;
}

/**
 * A single-row summary of the selected customer: name · phone · GSTIN · address
 * with an intra/inter-state badge on the right. Renders nothing when no customer
 * is selected (keeps the form short).
 */
export const CustomerInfoChip: React.FC<CustomerInfoChipProps> = ({
  control,
  shopState,
}) => {
  const customerId = useWatch({ control, name: "customer" });
  const { data: customer } = useGetCustomer(customerId || "");

  if (!customer) return null;

  const customerState =
    customer.billingAddress?.state || customer.shippingAddress?.state;
  const interState =
    !!shopState &&
    !!customerState &&
    shopState.trim().toLowerCase() !== customerState.trim().toLowerCase();

  const parts: string[] = [];
  if (customer.phone) parts.push(customer.phone);
  if (customer.email) parts.push(customer.email);
  if (customer.gstin) parts.push(`GSTIN ${customer.gstin}`);
  if (customer.billingAddress) {
    const a = customer.billingAddress;
    parts.push(
      [a.city, a.state, a.pinCode].filter(Boolean).join(" "),
    );
  }

  return (
    <div className="text-sm rounded-lg border border-gray-100 dark:border-gray-700/60 px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {customer.name}
      </span>
      {parts.length > 0 && (
        <span className="text-gray-600 dark:text-gray-300">
          · {parts.join(" · ")}
        </span>
      )}
      {customerState && shopState && (
        <span
          className={`ml-auto text-xs px-2 py-0.5 rounded ${
            interState
              ? "bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-200"
              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-200"
          }`}
        >
          {interState ? "Inter-state" : "Intra-state"}
        </span>
      )}
    </div>
  );
};
