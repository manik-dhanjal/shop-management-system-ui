import { IoTrash } from "react-icons/io5";
import { OrderItemPopulated } from "../interface/order-item.interface";

interface OrderItemListProps {
  orderItems: OrderItemPopulated[];
  handleChange: (updatedItems: OrderItemPopulated[]) => void;
}

export const OrderItemList: React.FC<OrderItemListProps> = ({
  orderItems,
  handleChange,
}) => {
  const setEmployeeToDelete = (item: OrderItemPopulated) => {
    const updatedItems = orderItems.filter(
      (i) => i.product._id !== item.product._id,
    );
    handleChange(updatedItems);
  };
  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto min-h-40">
        <table className="table-auto w-full">
          {/* Table header */}
          <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
            <tr>
              <th className="p-2 whitespace-nowrap">
                <div className="font-semibold text-left">Product Name</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Quantity</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Unit Price</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Total Price</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Actions</div>
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            {orderItems.map((item, idx) => {
              return (
                <tr key={item.product._id + idx}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{item.product.name}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {item.quantity} {item.product.measuringUnit}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center text-sm text-green-500">
                      {item.product.sellPrice}{" "}
                      {item.product.currency
                        ? item.product.currency.toUpperCase()
                        : ""}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center text-sm text-green-500">
                      {item.totalPrice}{" "}
                      {item.product.currency
                        ? item.product.currency.toUpperCase()
                        : ""}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-xl flex justify-center gap-5 text-gray-800 dark:text-gray-100">
                      <button onClick={() => setEmployeeToDelete(item)}>
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
    </>
  );
};
