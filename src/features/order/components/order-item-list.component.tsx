import { IoTrash } from "react-icons/io5";
import { OrderItemPopulated } from "../interface/order-item.interface";
import CounterInput from "@shared/components/form/counter-input.component";
import { ComputedLine } from "../utils/pricing.util";

interface OrderItemListProps {
  orderItems: OrderItemPopulated[];
  computedLines: ComputedLine[];
  /** When true, taxes are not collected (Bill of Supply / Retail). */
  taxExempt?: boolean;
  /** When true, tax appears under a single IGST column instead of CGST+SGST. */
  interState?: boolean;
  handleChange: (updatedItems: OrderItemPopulated[]) => void;
}

const cellLabel =
  "text-xs font-semibold uppercase text-gray-400 dark:text-gray-500";

// Tailwind classes to suppress the WebKit/Firefox number-input spinner arrows.
const noSpinner =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0";

export const OrderItemList: React.FC<OrderItemListProps> = ({
  orderItems,
  computedLines,
  taxExempt = false,
  interState = false,
  handleChange,
}) => {
  const updateAt = (idx: number, patch: Partial<OrderItemPopulated>) => {
    const next = orderItems.map((it, i) =>
      i === idx ? { ...it, ...patch } : it,
    );
    handleChange(next);
  };

  const removeAt = (idx: number) => {
    handleChange(orderItems.filter((_, i) => i !== idx));
  };

  if (!orderItems.length) {
    return (
      <div className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">
        No items added yet. Click <span className="font-medium">Add Item</span>{" "}
        to get started.
      </div>
    );
  }

  // Column widths. Product gets the most flex; everything else gets a fixed
  // percentage so HSN/Qty/Tax don't get squashed when product names are long.
  const showIgst = !taxExempt && interState;
  const showCgstSgst = !taxExempt && !interState;

  return (
    <div className="overflow-x-auto">
      <table className="table-fixed w-full min-w-[900px]">
        <colgroup>
          <col className="w-[26%]" /> {/* Product */}
          <col className="w-[7%]" /> {/* HSN */}
          <col className="w-[10%]" /> {/* Qty */}
          <col className="w-[11%]" /> {/* Unit Price */}
          <col className="w-[8%]" /> {/* Discount */}
          <col className="w-[10%]" /> {/* Taxable */}
          {showIgst && <col className="w-[10%]" />}
          {showCgstSgst && <col className="w-[8%]" />}
          {showCgstSgst && <col className="w-[8%]" />}
          <col className="w-[11%]" /> {/* Total */}
          <col className="w-[4%]" /> {/* trash */}
        </colgroup>
        <thead className="bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
          <tr>
            <th className={`p-2 text-left ${cellLabel}`}>Product</th>
            <th className={`p-2 text-left ${cellLabel}`}>HSN</th>
            <th className={`p-2 text-center ${cellLabel}`}>Qty</th>
            <th className={`p-2 text-right ${cellLabel}`}>Unit Price</th>
            <th className={`p-2 text-right ${cellLabel}`}>Discount</th>
            <th className={`p-2 text-right ${cellLabel}`}>Taxable</th>
            {showIgst && (
              <th className={`p-2 text-right ${cellLabel}`}>IGST</th>
            )}
            {showCgstSgst && (
              <>
                <th className={`p-2 text-right ${cellLabel}`}>CGST</th>
                <th className={`p-2 text-right ${cellLabel}`}>SGST</th>
              </>
            )}
            <th className={`p-2 text-right ${cellLabel}`}>Total</th>
            <th className={`p-2 text-center ${cellLabel}`}>&nbsp;</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
          {orderItems.map((item, idx) => {
            const line = computedLines[idx];
            const cgst = line?.taxes.find((t) => t.type === "CGST");
            const sgst = line?.taxes.find((t) => t.type === "SGST");
            const igst = line?.taxes.find((t) => t.type === "IGST");
            const overStock =
              typeof item.product.stock === "number" &&
              item.quantity > item.product.stock;

            return (
              <tr key={`${item.product?._id ?? "row"}-${idx}`}>
                <td className="p-2 align-top">
                  <div
                    className="font-medium text-gray-800 dark:text-gray-100 truncate"
                    title={item.product.name}
                  >
                    {item.product.name}
                  </div>
                  <div
                    className="text-xs text-gray-500 dark:text-gray-400 truncate"
                    title={item.product.sku}
                  >
                    SKU: {item.product.sku}
                  </div>
                </td>
                <td className="p-2 align-middle text-xs text-gray-600 dark:text-gray-300 truncate">
                  {item.product.hsn}
                </td>
                <td className="p-2 align-middle">
                  <div className="flex justify-center">
                    <CounterInput
                      value={item.quantity}
                      onChange={(q) => updateAt(idx, { quantity: q })}
                      min={1}
                      max={item.product.stock || 9999}
                    />
                  </div>
                  {overStock && (
                    <div className="text-xs text-red-500 text-center mt-1">
                      Only {item.product.stock} in stock
                    </div>
                  )}
                </td>
                <td className="p-2 align-middle text-right text-gray-700 dark:text-gray-200">
                  ₹{(item.product.sellPrice || 0).toFixed(2)}
                  <div className="text-xs text-gray-400">
                    per {item.product.measuringUnit}
                  </div>
                </td>
                <td className="p-2 align-middle text-right">
                  <input
                    type="number"
                    min={0}
                    value={item.discount ?? 0}
                    onChange={(e) =>
                      updateAt(idx, {
                        discount: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className={`w-20 text-right border rounded px-2 py-1 bg-transparent dark:border-gray-600 dark:text-gray-100 ${noSpinner}`}
                  />
                </td>
                <td className="p-2 align-middle text-right text-gray-700 dark:text-gray-200">
                  ₹{(line?.taxableValue ?? 0).toFixed(2)}
                </td>
                {showIgst && (
                  <td className="p-2 align-middle text-right text-gray-700 dark:text-gray-200">
                    <div>₹{(igst?.amount ?? 0).toFixed(2)}</div>
                    <div className="text-xs text-gray-400">
                      {igst?.rate ?? item.product.igstRate}%
                    </div>
                  </td>
                )}
                {showCgstSgst && (
                  <>
                    <td className="p-2 align-middle text-right text-gray-700 dark:text-gray-200">
                      <div>₹{(cgst?.amount ?? 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-400">
                        {cgst?.rate ?? item.product.cgstRate}%
                      </div>
                    </td>
                    <td className="p-2 align-middle text-right text-gray-700 dark:text-gray-200">
                      <div>₹{(sgst?.amount ?? 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-400">
                        {sgst?.rate ?? item.product.sgstRate}%
                      </div>
                    </td>
                  </>
                )}
                <td className="p-2 align-middle text-right font-medium text-gray-900 dark:text-gray-50">
                  ₹{(line?.totalPrice ?? 0).toFixed(2)}
                </td>
                <td className="p-2 align-middle">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeAt(idx)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <IoTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
