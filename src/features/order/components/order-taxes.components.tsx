import SectionBlock from "@shared/components/section-block";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { TaxType } from "../enum/tax-type.enum";

interface OrderTaxesProps {
  orderItems: OrderItemPopulated[];
}

const OrderTaxes = ({ orderItems }: OrderTaxesProps) => {
  const getTaxTotal = (type: TaxType) =>
    orderItems.reduce((total, item) => {
      const tax = item.taxes.find((t) => t.type === type);
      return total + (tax ? tax.amount : 0);
    }, 0);

  const cgst = getTaxTotal(TaxType.CGST);
  const sgst = getTaxTotal(TaxType.SGST);
  const igst = getTaxTotal(TaxType.IGST);
  const cess = getTaxTotal(TaxType.CESS);
  const totalGst = cgst + sgst + igst;
  const totalTaxes = totalGst + cess;

  return (
    <SectionBlock title="Tax Summary:" className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">SGST: </div>
          <div className="text-gray-900 dark:text-gray-100 w-[90px] text-right">
            ₹ {sgst.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">CGST: </div>
          <div className="text-gray-900 dark:text-gray-100 w-[90px] text-right">
            ₹ {cgst.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">IGST: </div>
          <div className="text-gray-900 dark:text-gray-100 w-[90px] text-right">
            ₹ {igst.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="font-bold">Total GST: </div>
          <div className="text-gray-900 dark:text-gray-100 w-[90px] text-right">
            ₹ {totalGst.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">Cess: </div>
          <div className="text-gray-900 dark:text-gray-100 w-[90px] text-right">
            ₹ {cess.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="font-bold">Total Taxes: </div>
          <div className="text-gray-900 dark:text-gray-100 w-[90px] text-right">
            ₹ {totalTaxes.toFixed(2)}
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default OrderTaxes;

