import { Product } from "@features/product/interfaces/product.interface";
import { Checkbox } from "@mui/material";
import { isNumber } from "lodash";
import { ChangeEventHandler } from "react";
import { IoAdd, IoCube, IoRemove } from "react-icons/io5";

export interface ProductCardProps {
  product: Product;
  quantity: number;
  handleQtyChange: (product: Product, qty: number) => void;
}

export const ProductCard = ({
  product,
  handleQtyChange,
  quantity,
}: ProductCardProps) => {
  const handleQtyIncreament = () => {
    handleQtyChange(product, quantity + 1);
  };
  const handleQtyDecrease = () => {
    if (quantity > 0) handleQtyChange(product, quantity - 1);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (element) => {
    element.preventDefault();
    const newQty = Number(element.currentTarget.value);
    if (isNumber(newQty) && newQty >= 0) {
      handleQtyChange(product, newQty);
    }
  };

  const handleCheckboxChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (checked && quantity === 0) {
      handleQtyChange(product, 1);
    } else if (!checked) {
      handleQtyChange(product, 0);
    }
  };
  return (
    <div
      className={`bg-white dark:bg-gray-700 rounded-lg mb-4 flex flex-col items-start overflow-hidden relative border dark:border-gray-600 transition-shadow shadow-md ${
        quantity !== 0
          ? " border-violet-300 shadow-purple-300  dark:shadow-purple-800 dark:border-purple-800"
          : ""
      }`}
    >
      {/* Product Image */}
      <div className=" w-full h-32 shadow-sm relative">
        {product.images.length ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-white dark:bg-gray-800">
            <IoCube className="text-4xl text-gray-300 dark:text-gray-500" />
          </div>
        )}

        <div className="bg-gradient-to-tr to-[rgba(0,0,0,0.5)] from-[rgba(0,0,0,0)] to-99% absolute top-0 left-0 right-0 bottom-0 opacity-50" />
        <Checkbox
          checked={quantity !== 0}
          onChange={handleCheckboxChange}
          className=" top-2 right-2"
          style={{
            position: "absolute",
            boxShadow:
              quantity !== 0
                ? "inset 0 0 10px rgba(139, 92, 246, 0.8)" // Violet shadow
                : "none",
          }}
        />
      </div>
      {/* Product Details */}
      <div className="p-3">
        <h3 className="text-sm dark:text-white mb-0.5">{product.name}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          {product.description}
        </p>

        {/* Quantity Counter */}
        <div className="inline-flex items-center mt-auto border dark:border-gray-500 rounded-lg focus:border-purple-800 float-right">
          <button onClick={handleQtyDecrease} className="pl-2 py-2 pr-1">
            <IoRemove className="text-sm" />
          </button>
          <input
            className="text-sm dark:text-white w-6 bg-transparent text-center outline-none"
            value={quantity}
            onChange={handleInputChange}
          />
          <button onClick={handleQtyIncreament} className="pr-2 py-2 pl-1">
            <IoAdd className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};
