import SectionBlock from "@shared/components/section-block";
import { InventoryPopulated } from "../interfaces/inventory.interface";
import Button from "@shared/components/form/button.component";

interface ProductInventoryTableProp
  extends React.HTMLAttributes<HTMLDivElement> {
  inventory: InventoryPopulated[];
}

export const ProductInventoryTable = ({
  className,
  inventory,
}: ProductInventoryTableProp) => {
  return (
    <SectionBlock
      title={
        <div className="flex justify-between items-center">
          <h3 className="text-lg">Inventory</h3>{" "}
          <Button type="button" secondary>
            Add Inventory
          </Button>
        </div>
      }
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="table-auto w-full dark:text-gray-300">
          {/* Table header */}
          <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
            <tr>
              <th className="p-2">
                <div className="font-semibold text-left">Supplier Name</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-center">Purchase Date</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-center">Qty</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-center">Purchase Price</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-right">Sell Price</div>
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
            {inventory.map((item, index) => (
              <tr key={"inventory-item" + index}>
                <td className="p-2 whitespace-nowrap overflow-ellipsis">
                  {/* Product Name */}
                  <div className="text-gray-800 dark:text-gray-100">
                    {item.supplier.name}
                  </div>
                </td>
                {/* Unit Price */}
                <td className="p-2">
                  <div className="text-center">₹ {item.purchasePrice}</div>
                </td>
                {/* Quantity */}
                <td className="p-2">
                  <div className="text-center text-green-500">
                    {item.quantity}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionBlock>
  );
};
