import { useState } from "react";
import { useGetPaginatedInventory } from "@features/inventory/hooks/use-get-paginated-inventory.hook";
import { InventoryItemEditModal } from "@features/inventory/components/inventory-item-edit-modal.component";
import { Inventory } from "@features/inventory/interface/inventory.interface";
import { Pagination } from "@shared/components/pagination.component";
import { DateView } from "@shared/components/date-view.component";
import { IoPencil, IoTrash } from "react-icons/io5";
import { CircularProgress } from "@mui/material";

const MAX_INVENTORY_ITEMS_ON_SINGLE_PAGE = 10;

const AllInventoryPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const inventory = useGetPaginatedInventory(
    MAX_INVENTORY_ITEMS_ON_SINGLE_PAGE,
    currentPage,
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleInventoryItemEdit = (item: Inventory) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleInventoryDelete = (item: Inventory) => {
    console.log("Delete inventory item:", item);
  };

  if (inventory.isError) {
    return <div>Error loading inventory: {inventory.error.message}</div>;
  }

  if (inventory.isLoading || !inventory.data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mb-6">
        Inventory
      </h1>
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-8">
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
                <tr>
                  <th className="p-2">
                    <div className="font-semibold text-left">Supplier</div>
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
                    <div className="font-semibold text-center">Sell Price</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-right">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
                {inventory.data.docs.map((item) => (
                  <tr key={item._id}>
                    <td className="p-2 whitespace-nowrap overflow-ellipsis">
                      <div className="text-gray-800 dark:text-gray-100">
                        {item.supplier.name}
                      </div>
                    </td>
                    <td className="p-2">
                      <DateView date={item.createdAt} />
                    </td>
                    <td className="p-2">
                      <div className="text-center">
                        {item.initialQuantity} {item.measuringUnit}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-green-500">
                        {item.currentQuantity} {item.measuringUnit}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">
                        {item.purchasePrice} {item.currency}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">
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
        </div>
      </div>
      {inventory.data.pagination.totalPages > 1 && (
        <Pagination
          activePage={inventory.data.pagination.currentPage}
          onChange={handlePageChange}
          totalPages={inventory.data.pagination.totalPages}
          maxPageToShow={5}
        />
      )}
      <InventoryItemEditModal
        selectedItem={selectedItem}
        closeModal={closeModal}
        isOpen={isOpen}
        isEditing={isEditing}
        product={null}
      />
    </div>
  );
};

export default AllInventoryPage;
