import { Control } from "react-hook-form";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import DateFieldControlled from "@shared/components/form/date-field-controlled.component";
import SelectFieldControlled from "@shared/components/form/select-field-controlled.component";
import { InvoiceType } from "@shared/enums/invoice-type.enum";

interface OrderMetaFieldsProps {
  control: Control<any>;
}

/**
 * Renders the three top fields (Invoice ID, Invoice Type, Order Date) as
 * unwrapped children so the caller can place them inside a grid of any shape.
 * Description is rendered separately by `OrderDescriptionField` below.
 */
export const OrderMetaFields: React.FC<OrderMetaFieldsProps> = ({
  control,
}) => {
  return (
    <>
      <TextFieldControlled
        label="Invoice ID"
        name="invoiceId"
        control={control}
        placeholder="INV/25-26/0001"
        required
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <SelectFieldControlled
        label="Invoice Type"
        name="invoiceType"
        control={control}
        options={Object.values(InvoiceType)}
      />

      <DateFieldControlled
        label="Order Date"
        name="orderDate"
        control={control}
      />
    </>
  );
};

export const OrderDescriptionField: React.FC<OrderMetaFieldsProps> = ({
  control,
}) => (
  <TextFieldControlled
    label="Description"
    name="description"
    control={control}
    multiline
    rows={2}
    placeholder="Any notes about this order"
  />
);
