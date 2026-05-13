import { ComputedOrder, amountInWords } from "../utils/pricing.util";
import { TaxType } from "@shared/enums/tax-type.enum";

interface InvoiceSummaryProps {
  computed: ComputedOrder;
  orderDiscount: number;
  onOrderDiscountChange: (value: number) => void;
}

const Row: React.FC<{
  label: string;
  value: string;
  emphasis?: boolean;
  negative?: boolean;
}> = ({ label, value, emphasis, negative }) => (
  <div
    className={`flex justify-between py-1 text-sm ${
      emphasis
        ? "font-semibold text-gray-900 dark:text-gray-50"
        : "text-gray-600 dark:text-gray-300"
    }`}
  >
    <span>{label}</span>
    <span>
      {negative ? "− " : ""}
      {value}
    </span>
  </div>
);

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const noSpinner =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0";

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  computed,
  orderDiscount,
  onOrderDiscountChange,
}) => {
  const { billing } = computed;

  // Consolidate per-rate tax entries into a single total per tax type.
  // The print invoice keeps the per-rate detail; the in-form summary shows
  // one row per type for readability.
  const taxByType = new Map<TaxType, number>();
  for (const t of billing.taxes) {
    taxByType.set(t.type, (taxByType.get(t.type) || 0) + t.amount);
  }

  return (
    <aside className="dark:bg-gray-800 bg-white rounded-xl border border-gray-100 dark:border-gray-700/60">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Invoice Summary
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            billing.taxExempt
              ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              : billing.interState
                ? "bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-200"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-200"
          }`}
        >
          {billing.taxExempt
            ? "Tax exempt"
            : billing.interState
              ? "Inter-state · IGST"
              : "Intra-state · CGST+SGST"}
        </span>
      </div>

      <div className="px-4 py-3 space-y-1">
        <Row label="Sub Total" value={money(billing.subTotal)} />
        {billing.itemDiscountTotal > 0 && (
          <Row
            label="Item Discount"
            value={money(billing.itemDiscountTotal)}
            negative
          />
        )}

        <div className="flex justify-between items-center py-1 text-sm text-gray-600 dark:text-gray-300">
          <span>Order Discount</span>
          <div className="flex items-center gap-1">
            <span>− ₹</span>
            <input
              type="number"
              min={0}
              value={orderDiscount || 0}
              onChange={(e) =>
                onOrderDiscountChange(Math.max(0, Number(e.target.value) || 0))
              }
              className={`w-24 text-right border rounded px-2 py-1 bg-transparent dark:border-gray-600 dark:text-gray-100 ${noSpinner}`}
            />
          </div>
        </div>

        <Row label="Taxable Amount" value={money(billing.taxableAmount)} />

        {!billing.taxExempt && taxByType.size > 0 && (
          <>
            {Array.from(taxByType.entries()).map(([type, amount]) => (
              <Row key={type} label={type} value={money(amount)} />
            ))}
          </>
        )}

        <div className="my-2 border-t border-dashed dark:border-gray-700/60" />

        <Row label="Grand Total" value={money(billing.grandTotal)} />
        <Row
          label="Round Off"
          value={money(billing.roundOff)}
          negative={billing.roundOff < 0}
        />

        <div className="my-2 border-t dark:border-gray-700/60" />

        <Row
          label="Final Amount"
          value={money(billing.finalAmount)}
          emphasis
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 italic">
          {amountInWords(billing.finalAmount)}
        </p>
      </div>
    </aside>
  );
};
