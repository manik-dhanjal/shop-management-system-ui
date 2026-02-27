import React, { useState, useMemo, useEffect, useRef } from "react";
import Modal from "@shared/components/hoc/modal.component";
import { usePaginatedProducts } from "@features/product/hooks/use-get-paginated-products.hook";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { Product } from "@features/product/interfaces/product.interface";
import Button from "@shared/components/form/button.component";
import CounterInput from "@shared/components/form/counter-input.component";
import { TextField } from "@mui/material";

const MAX_PRODUCTS_PER_LOAD = 10;

interface OrderItemSelectModalProps {
  close: () => void;
  /** previously selected items, quantities will be retained */
  existingItems?: OrderItemPopulated[];
  onAdd: (items: OrderItemPopulated[]) => void;
}

export const OrderItemSelectModal: React.FC<OrderItemSelectModalProps> = ({
  close,
  existingItems = [],
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    existingItems.reduce(
      (acc, item) => {
        acc[item.product._id] = item.quantity;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  // load products for current page
  const { data, isLoading } = usePaginatedProducts(
    MAX_PRODUCTS_PER_LOAD,
    currentPage,
  );

  // Accumulate products as new pages load
  useEffect(() => {
    if (data?.docs) {
      if (currentPage === 1) {
        setAllProducts(data.docs);
      } else {
        setAllProducts((prev) => [...prev, ...data.docs]);
      }
      // Check if there are more pages to load
      setHasMore(data.pagination?.nextPage !== null);
    }
  }, [data, currentPage]);

  const products: Product[] = allProducts;

  const filtered = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isNearBottom = container.scrollHeight - container.scrollTop < 400;
    if (isNearBottom && !isLoading && hasMore && searchTerm === "") {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleQtyChange = (id: string, qty: number) => {
    setQuantities((q) => ({ ...q, [id]: qty }));
  };

  const handleAddClick = () => {
    const items: OrderItemPopulated[] = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const prod = products.find((p) => p._id === id)!;
        return {
          product: prod,
          quantity: qty,
          discount: 0,
          taxableValue: 0,
          taxes: [],
          totalPrice: prod.price * qty,
        };
      });
    onAdd(items);
    close();
  };

  return (
    <Modal title="Select Products" onClose={close}>
      <div className="space-y-4">
        <TextField
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full "
        />
        {isLoading && filtered.length === 0 ? (
          <div>Loading products...</div>
        ) : (
          <div
            className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 dark:scrollbar-thumb-slate-300 scrollbar-track-slate-50 pr-1"
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-center w-5">Price</th>
                  <th className="p-2 text-center">Stock</th>
                  <th className="p-2 text-center  w-5">Qty</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {filtered.map((p, idx) => (
                  <tr key={p._id + idx + "product-for-selection"}>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {p.price} {p.currency ? p.currency.toUpperCase() : ""}
                    </td>
                    <td className="p-2 text-center text-green-600">
                      {p.stock}
                    </td>
                    <td className="p-2 flex justify-end">
                      <CounterInput
                        value={quantities[p._id] || 0}
                        onChange={(qty) => handleQtyChange(p._id, qty)}
                        min={0}
                        max={p.stock}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isLoading && currentPage > 1 && (
              <div className="p-2 text-gray-500">Loading more products...</div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleAddClick} className="btn btn-primary">
            Add Selected
          </Button>
        </div>
      </div>
    </Modal>
  );
};
