import SectionBlock from "@shared/components/section-block";
import { Inventory } from "../interface/inventory.interface";
import Button from "@shared/components/form/button.component";
import { useState } from "react";
import { DateView } from "@shared/components/date-view.component";
import { IoPencil, IoTrash } from "react-icons/io5";
import { useGetPaginatedInventory } from "@features/inventory/hooks/use-get-paginated-inventory.hook";
import { omit as _omit } from "lodash";
import { InventoryItemEditModal } from "@features/inventory/components/inventory-item-edit-modal.component";
import { Product } from "../../product/interfaces/product.interface";
import { Pagination } from "@shared/components/pagination.component";

const MAX_INVENTORY_ITEMS_ON_SINGLE_PAGE = 10;

interface ProductInventoryTableProp {
  product: Product;
  className?: string;
}

export const ProductInventoryTable = ({
  product,
  className,
}: ProductInventoryTableProp) => {
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const inventory = useGetPaginatedInventory(
    MAX_INVENTORY_ITEMS_ON_SINGLE_PAGE,
    currentPage,
    {
      product: product._id,
    },
  );
  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleInventoryDelete = (item: Inventory) => {
    console.log("Delete inventory item:", item);
  };

  const handleInventoryAdd = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsOpen(true);
  };

  const handleInventoryItemEdit = (item: Inventory) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsOpen(true);
  };
  if (inventory.isError) {
    return <div>Error loading inventory: {inventory.error.message}</div>;
  }
  if (inventory.isLoading || !inventory.data) {
    return <div>Loading inventory...</div>;
  }
  return (
    <>
      {" "}
      <SectionBlock
        title={
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Inventory</h3>{" "}
            <Button type="button" secondary onClick={handleInventoryAdd}>
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
                  <div className="font-semibold text-center">Purchased At</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Initial Qty</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Current Qty</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">
                    Purchase Price
                  </div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-right">Sell Price</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-right">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {inventory.data?.docs.map((item, index) => (
                <tr key={"inventory-item" + index}>
                  <td className="p-2 whitespace-nowrap overflow-ellipsis">
                    {/* Product Name */}
                    <div className="text-gray-800 dark:text-gray-100">
                      {item.supplier.name}
                    </div>
                  </td>

                  {/* Purchased At*/}
                  <td className="p-2">
                    <DateView date={item.createdAt} />
                  </td>

                  {/* Initial Quantity */}
                  <td className="p-2">
                    <div className="text-center">
                      {item.initialQuantity} {item.measuringUnit}
                    </div>
                  </td>

                  {/* Current Quantity */}
                  <td className="p-2">
                    <div className="text-center text-green-500">
                      {item.currentQuantity} {item.measuringUnit}
                    </div>
                  </td>

                  {/* Purchase Price */}
                  <td className="p-2">
                    <div className="text-center">
                      {item.purchasePrice} {item.currency}
                    </div>
                  </td>

                  {/* Sell Price */}
                  <td className="p-2">
                    <div className="text-right">
                      {item.sellPrice} {item.currency}
                    </div>
                  </td>

                  <td className="p-2 whitespace-nowrap">
                    <div className="text-xl flex justify-end gap-3 text-gray-800 dark:text-gray-100">
                      <button onClick={() => handleInventoryItemEdit(item)}>
                        <IoPencil />
                      </button>
                      <button onClick={() => handleInventoryDelete(item)}>
                        <IoTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inventory.data.pagination.totalPages > 1 && (
          <Pagination
            activePage={inventory.data.pagination.currentPage}
            onChange={handlePageChange}
            totalPages={inventory.data.pagination.totalPages}
            maxPageToShow={5}
          />
        )}
      </SectionBlock>
      <InventoryItemEditModal
        selectedItem={selectedItem}
        closeModal={closeModal}
        isOpen={isOpen}
        isEditing={isEditing}
        product={product}
      />
    </>
  );
};
