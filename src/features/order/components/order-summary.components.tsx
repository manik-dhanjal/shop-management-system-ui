import SectionBlock from "@shared/components/section-block";
import { Control, useWatch } from "react-hook-form";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { OrderFormTypes } from "./order-form.component";
import { NumberFieldControlled } from "@shared/components/form/number-input-controller.component";

interface OrderSummaryProps {
  orderItems: OrderItemPopulated[];
  control: Control<any>;
}

const OrderSummary = ({ orderItems, control }: OrderSummaryProps) => {
  const subTotal = orderItems.reduce(
    (total, orderItem) => orderItem.taxableValue + total,
    0,
  );

  const totalTaxes = orderItems.reduce((totalTax, orderItem) => {
    return (
      orderItem.taxes.reduce(
        (orderTaxTotal, tax) => tax.amount + orderTaxTotal,
        0,
      ) + totalTax
    );
  }, 0);

  const watch = useWatch<OrderFormTypes>({ control });

  const totalPayable =
    totalTaxes +
    subTotal -
    (watch.billing?.discounts ?? 0) +
    (watch.billing?.roundOff ?? 0);

  return (
    <div className="max-w-[400px] w-full ml-auto">
      <SectionBlock title="Summary:">
        {/* subtotal */}
        <div className="flex justify-between ">
          <div>Subtotal:</div>
          <div className=" text-gray-900 dark:text-gray-100">₹ {subTotal}</div>
        </div>
        {/* taxes */}
        <div className="flex justify-between gap-2 mt-4">
          <div className="font-bold">Taxes:</div>
          <div className=" text-gray-900 dark:text-gray-100">
            ₹ {totalTaxes}
          </div>
        </div>
        {/* grand total */}
        <div className="flex justify-between mt-4">
          <div className="font-semibold">Grand Total:</div>
          <div className=" text-gray-900 dark:text-gray-100">
            ₹ {subTotal + totalTaxes}
          </div>
        </div>
        {/* Discount */}
        <div className=" mt-4 flex items-center justify-between gap-3">
          <div className="font-semibold">Discount: </div>
          <div className="flex gap-3">
            <NumberFieldControlled
              size="small"
              className="w-[90px]"
              placeholder="18%"
              name="billing.discounts"
              control={control}
              type="number"
            />
            <NumberFieldControlled
              size="small"
              className="w-[90px]"
              placeholder="100$"
              name="billing.discounts"
              control={control}
              type="number"
            />
          </div>
        </div>
        {/* Round off */}
        <div className=" mt-4 flex items-center justify-between gap-3">
          <div className="font-semibold">Round Off: </div>
          <NumberFieldControlled
            size="small"
            className="w-[90px]"
            placeholder="₹ 0.0"
            control={control}
            name="billing.roundOff"
          />
        </div>
        {/* Total Payable*/}
        <div className=" mt-4 flex items-center justify-between gap-3">
          <div className="font-semibold  text-gray-900 dark:text-gray-100">
            Total Payable:{" "}
          </div>
          <div className=" text-gray-900 dark:text-gray-100">
            ₹ {totalPayable}
          </div>
        </div>
      </SectionBlock>
    </div>
  );
};

export default OrderSummary;
