import { Button } from "@mui/material";
import SectionBlock from "@shared/components/section-block";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";
import SelectProductPopup from "./select-product-popup.component";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { useAuth } from "@shared/hooks/auth.hooks";

interface OrderItemListProps {
  orderItems: OrderItemPopulated[];
  onOrderItemsChange: (newOrderItems: OrderItemPopulated[]) => void;
  shippingCountry: string;
  shippingState: string;
}

export const OrderItemList = ({
  onOrderItemsChange,
  orderItems,
  shippingCountry,
  shippingState,
}: OrderItemListProps) => {
  const [isProductSelectOpen, setIsProductSelectOpen] = useState(false);
  const handleProductSelectOpen = () => setIsProductSelectOpen(true);
  const handleProductSelectClose = () => setIsProductSelectOpen(false);
  const auth = useAuth();

  const handleOrderItemRemove = (productId: string) => {
    const newList = orderItems.filter(
      (orderItem) => orderItem.productId._id !== productId,
    );
    onOrderItemsChange(newList);
  };
  console.log(shippingCountry, shippingState, auth.activeShop?.location.state);

  return (
    <>
      <SelectProductPopup
        handleClose={handleProductSelectClose}
        open={isProductSelectOpen}
        onOrderItemsChange={onOrderItemsChange}
        orderItems={orderItems}
      />
      <SectionBlock title="Product Details:" className="w-full">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Product Names</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Unit Price</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Qty</div>
                </th>
                {auth.activeShop?.location.country === shippingCountry && (
                  <>
                    {auth.activeShop?.location.state === shippingState ||
                    !auth.activeShop?.location.state ? (
                      <>
                        <th className="p-2">
                          <div className="font-semibold text-center">CGST</div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-center">SGST</div>
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="p-2">
                          <div className="font-semibold text-center">IGST</div>
                        </th>
                      </>
                    )}
                  </>
                )}
                <th className="p-2">
                  <div className="font-semibold text-center">Total</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center"></div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {orderItems.map((orderItem, index) => (
                <TableRow
                  orderItem={orderItem}
                  key={"order-item" + index}
                  removeItem={handleOrderItemRemove}
                  shippingCountry={shippingCountry}
                  shippingState={shippingState}
                />
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Button variant="outlined" onClick={handleProductSelectOpen}>
              Add Product
            </Button>
          </div>
        </div>
      </SectionBlock>
    </>
  );
};

interface TableRowProps {
  shippingCountry: string;
  shippingState: string;
  orderItem: OrderItemPopulated;
  removeItem: (productId: string) => void;
}
const TableRow = ({
  orderItem,
  removeItem,
  shippingCountry,
  shippingState,
}: TableRowProps) => {
  const auth = useAuth();
  if (orderItem.productId.stock === 0)
    return (
      <tr>
        <td className="p-2 whitespace-nowrap overflow-ellipsis">
          {/* Product Name */}
          <div className="text-gray-800 dark:text-gray-100">
            {orderItem.productId.name}
          </div>
        </td>
        {/* Unit Price */}
        <td className="p-2">Inventory Not Avialable</td>
      </tr>
    );

  return (
    <tr>
      <td className="p-2 whitespace-nowrap overflow-ellipsis">
        {/* Product Name */}
        <div className="text-gray-800 dark:text-gray-100">
          {orderItem.productId.name}
        </div>
      </td>
      {/* Unit Price */}
      <td className="p-2">
        {/* TODO: update schema to store sell price in product */}
        <div className="text-center">₹ {orderItem.productId.stock}</div>
      </td>
      {/* Quantity */}
      <td className="p-2">
        <div className="text-center text-green-500">{orderItem.quantity}</div>
      </td>

      {/* GST */}
      {shippingCountry === "India" && (
        <>
          {shippingState === auth.activeShop?.location.state ||
          !shippingState ? (
            <>
              <td className="p-2">
                <div className="text-center text-green-500">
                  {orderItem.productId.cgstRate}%
                </div>
              </td>

              <td className="p-2">
                <div className="text-center text-green-500">
                  {orderItem.productId.sgstRate}%
                </div>
              </td>
            </>
          ) : (
            <td className="p-2">
              <div className="text-center text-green-500">
                {orderItem.productId.igstRate}%
              </div>
            </td>
          )}
        </>
      )}

      {/* Total Price */}
      <td className="p-2">
        <div className="text-center">₹ {orderItem.totalPrice}</div>
      </td>
      <td
        className="p-2 flex justify-center"
        onClick={() => removeItem(orderItem.productId._id)}
      >
        <IoTrash />
      </td>
    </tr>
  );
};
