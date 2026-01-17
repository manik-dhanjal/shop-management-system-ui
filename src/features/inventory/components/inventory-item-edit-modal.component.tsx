import SectionBlock from "@shared/components/section-block";
import { Inventory } from "../interface/inventory.interface";
import Button from "@shared/components/form/button.component";
import { Modal } from "@mui/material";
import { useMemo, useEffect } from "react";
import { Shop } from "@features/shop/interface/shop.interface";
import * as yup from "yup";
import { TextFieldControlled } from "@shared/components/form/text-field-controlled.component";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import { useForm } from "react-hook-form";
import { DateTimeSelect } from "@shared/components/form/date-time-select.component";
import { MeasuringUnit } from "@features/product/enum/measuring-unit.enum";
import DropdownControlled from "@shared/components/form/dropdown-controlled.component";
import { MEASURING_UNIT_OPTIONS } from "@features/product/enum/measuring-unit.options";
import { omit as _omit } from "lodash";
import { useUpdateInventoryItem } from "@features/inventory/hooks/use-update-inventory-item.hook";
import { Product } from "@features/product/interfaces/product.interface";

export interface InventoryFormType extends Omit<
  Inventory,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "__v"
  | "shop"
  | "product"
  | "supplier"
  | "purchasedAt"
> {
  _id?: string;
  supplier: Shop<string> | null;
  purchasedAt: Date | null;
}

interface InventoryChangeModalProp {
  selectedItem: Inventory | null;
  isOpen: boolean;
  closeModal: () => void;
  isEditing?: boolean;
  product: Product | null;
}
const INITIAL_INVENTORY_FORM: InventoryFormType = {
  currentQuantity: 0,
  initialQuantity: 0,
  purchasePrice: 0,
  sellPrice: 0,
  measuringUnit: MeasuringUnit.PIECES,
  currency: "",
  purchasedAt: null,
  supplier: null,
  invoiceUrl: "",
};

export const InventoryItemEditModal = ({
  selectedItem,
  isOpen,
  isEditing = true,
  product,
  closeModal,
}: InventoryChangeModalProp) => {
  if (isOpen && isEditing && !selectedItem) {
    throw new Error("selectedItem is required when isEditing is true");
  }
  if (isOpen && !isEditing && !product) {
    throw new Error("product must be required when isEditing is false");
  }

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        currentQuantity: yup
          .number()
          .typeError("Current Quantity must be a number")
          .min(0, "Current Quantity cannot be negative")
          .required("Current Quantity is required")
          .test(
            "current-lte-initial",
            "Current Quantity cannot be more than Initial Quantity",
            function (value) {
              const { initialQuantity } = this.parent;
              if (
                typeof value !== "number" ||
                typeof initialQuantity !== "number"
              )
                return true;
              return value <= initialQuantity;
            },
          ),
        initialQuantity: yup
          .number()
          .typeError("Initial Quantity must be a number")
          .min(0, "Initial Quantity cannot be negative")
          .required("Initial Quantity is required"),
        purchasePrice: yup
          .number()
          .typeError("Purchase Price must be a number")
          .min(0, "Purchase Price cannot be negative")
          .required("Purchase Price is required"),
        sellPrice: yup
          .number()
          .typeError("Sell Price must be a number")
          .min(0, "Sell Price cannot be negative")
          .required("Sell Price is required"),
        measuringUnit: yup.string().required("Measuring Unit is required"),
        currency: yup.string().required("Currency is required"),
        purchasedAt: yup.date().required("Purchased At is required"),
      }),
    [],
  );

  const resolver = useYupValidationResolver(validationSchema);
  const { control, handleSubmit, reset } = useForm<InventoryFormType>({
    resolver,
    defaultValues: selectedItem
      ? {
          currentQuantity: selectedItem.currentQuantity,
          initialQuantity: selectedItem.initialQuantity,
          purchasePrice: selectedItem.purchasePrice,
          sellPrice: selectedItem.sellPrice,
          measuringUnit: selectedItem.measuringUnit,
          currency: selectedItem.currency,
          purchasedAt: new Date(selectedItem.purchasedAt),
          supplier: selectedItem.supplier,
          invoiceUrl: selectedItem.invoiceUrl,
        }
      : INITIAL_INVENTORY_FORM,
  });

  // Watch for changes in selectedItem and update form values
  useEffect(() => {
    if (selectedItem) {
      reset({
        currentQuantity: selectedItem.currentQuantity,
        initialQuantity: selectedItem.initialQuantity,
        purchasePrice: selectedItem.purchasePrice,
        sellPrice: selectedItem.sellPrice,
        measuringUnit: selectedItem.measuringUnit,
        currency: selectedItem.currency,
        purchasedAt: new Date(selectedItem.purchasedAt),
        supplier: selectedItem.supplier,
        invoiceUrl: selectedItem.invoiceUrl,
      });
    } else {
      reset(INITIAL_INVENTORY_FORM);
    }
  }, [selectedItem, reset]);

  const updateInventory = useUpdateInventoryItem();
  const onFormSubmit = async (data: InventoryFormType) => {
    console.log("Form submitted with data:", data);
    // Handle form submission logic here (e.g., call API to add/update inventory)
    if (!selectedItem || !selectedItem?.shop) return;

    updateInventory.mutate({
      inventoryId: selectedItem?._id || "",
      newInventoryItem: {
        ...data,
        _id: selectedItem._id,
        supplier: data.supplier?._id as string,
        purchasedAt: data.purchasedAt?.toISOString() as string,
        shop: selectedItem.shop,
        product: selectedItem.product,
      },
    });
    closeModal();
  };
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="inventory-modal-title"
      aria-describedby="inventory-modal-description"
    >
      <SectionBlock
        title="Edit Inventory"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] lg:w-[60%] bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <form>
          {/* Form fields for editing inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextFieldControlled
              name="initialQuantity"
              control={control}
              label="Initial Quantity"
              type="number"
              fullWidth
            />
            <TextFieldControlled
              name="currentQuantity"
              control={control}
              label="Current Quantity"
              type="number"
              fullWidth
            />
            <TextFieldControlled
              name="purchasePrice"
              control={control}
              label="Purchase Price"
              type="number"
              fullWidth
            />
            <TextFieldControlled
              name="sellPrice"
              control={control}
              label="Sell Price"
              type="number"
              fullWidth
            />
            <DropdownControlled
              name="measuringUnit"
              control={control}
              label="Measuring Unit"
              options={MEASURING_UNIT_OPTIONS}
            />
            <TextFieldControlled
              name="currency"
              control={control}
              label="Currency (e.g., USD, EUR)"
              type="text"
              fullWidth
            />
            <DateTimeSelect
              name="purchasedAt"
              control={control}
              label="Purchased At"
            />
            <TextFieldControlled
              name="invoiceUrl"
              control={control}
              label="Invoice URL"
              type="text"
              fullWidth
            />
          </div>
          <div className="flex justify-end mt-6 gap-4">
            <Button type="button" secondary onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onFormSubmit)}
              isLoading={updateInventory.isPending}
            >
              {isEditing ? "Save Changes" : "Add Inventory"}
            </Button>
          </div>
        </form>
      </SectionBlock>
    </Modal>
  );
};
