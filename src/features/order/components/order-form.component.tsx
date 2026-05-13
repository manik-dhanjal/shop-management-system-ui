import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@mui/material";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import { FormContainer } from "@shared/components/form-container.component";
import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { PaymentMethod } from "@shared/enums/payment-method.enum";
import { PaymentStatus } from "@shared/enums/payment-status.enum";
import { OrderItemList } from "./order-item-list.component";
import { OrderItemSelectModal } from "./order-item-select-modal.component";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { Order } from "../interface/order.interface";
import { BillingDetails } from "../interface/billing-details.interface";
import { PaymentDetails } from "../interface/payment-details.interface";
import {
  OrderMetaFields,
  OrderDescriptionField,
} from "./order-meta.component";
import {
  CustomerSelectSlot,
  CustomerInfoChip,
} from "./order-customer-card.component";
import { InvoiceSummary } from "./invoice-summary.component";
import { PaymentDetailsCard } from "./payment-details.component";
import { usePreviewInvoiceId } from "../hooks/use-preview-invoice-id.hook";
import { useGetCustomer } from "@features/customer/hooks/use-get-customer.hook";
import { useShop } from "@shared/hooks/shop.hook";
import { computeOrderTotals } from "../utils/pricing.util";

export interface OrderFormTypes extends Partial<
  Omit<
    Order,
    "billing" | "payment" | "shop" | "createdAt" | "updatedAt" | "__v" | "items"
  >
> {
  billing: Partial<BillingDetails>;
  payment: Partial<PaymentDetails>;
  items: OrderItemPopulated[];
  /** Order-level discount in absolute ₹ (UI-only; folded into billing.discounts on submit). */
  orderDiscount?: number;
  /** ISO date string for when the order was placed. */
  orderDate?: string;
}

interface OrderFormProps {
  onSubmit: SubmitHandler<OrderFormTypes>;
  isLoading: boolean;
  initialOrderData?: Partial<OrderFormTypes>;
  submitLabel?: string;
}

export const INITIAL_FORM_VALUES: OrderFormTypes = {
  invoiceId: undefined,
  customer: undefined,
  invoiceType: InvoiceType.TAX_INVOICE,
  items: [],
  description: undefined,
  orderDiscount: 0,
  orderDate: new Date().toISOString(),
  billing: {
    subTotal: 0,
    discounts: 0,
    grandTotal: 0,
    roundOff: 0,
    finalAmount: 0,
  },
  payment: {
    paymentMethod: PaymentMethod.CASH,
    status: PaymentStatus.PENDING,
    amountPaid: 0,
    paymentDate: new Date().toISOString(),
  },
};

const schema = yup.object({
  invoiceId: yup.string().required("Invoice ID is required"),
  customer: yup.string().required("Customer is required"),
  invoiceType: yup
    .mixed<InvoiceType>()
    .oneOf(Object.values(InvoiceType))
    .required("Invoice type is required"),
  items: yup
    .array()
    .of(yup.object({}))
    .min(1, "At least one item is required"),
  description: yup.string().optional(),
  orderDate: yup.string().required("Order date is required"),
  payment: yup.object({
    paymentMethod: yup
      .mixed<PaymentMethod>()
      .oneOf(Object.values(PaymentMethod))
      .required("Payment method is required"),
    status: yup
      .mixed<PaymentStatus>()
      .oneOf(Object.values(PaymentStatus))
      .required("Payment status is required"),
    amountPaid: yup.number().min(0).required("Amount paid is required"),
    transactionId: yup.string().optional(),
    notes: yup.string().optional(),
    paymentDate: yup.string().required("Payment date is required"),
  }),
});

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  initialOrderData,
  isLoading,
  submitLabel = "Save & Generate Invoice",
}) => {
  const resolver = useYupValidationResolver(schema);
  const { activeShop } = useShop();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<OrderFormTypes>({
    defaultValues: initialOrderData
      ? { ...INITIAL_FORM_VALUES, ...initialOrderData }
      : INITIAL_FORM_VALUES,
    resolver,
  });

  const items = watch("items") || [];
  const orderDiscount = watch("orderDiscount") || 0;
  const invoiceType = watch("invoiceType");
  const customerId = watch("customer");

  const { data: customer } = useGetCustomer(customerId || "");
  const shopState = activeShop?.location?.state;
  const customerState =
    customer?.billingAddress?.state || customer?.shippingAddress?.state;

  // Auto-fill invoice id on a fresh form (skips when editing).
  const { data: previewedInvoiceId } = usePreviewInvoiceId(
    !initialOrderData?.invoiceId,
  );
  useEffect(() => {
    if (previewedInvoiceId && !watch("invoiceId")) {
      setValue("invoiceId", previewedInvoiceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewedInvoiceId]);

  const computed = useMemo(
    () =>
      computeOrderTotals({
        items,
        orderDiscount,
        shopState,
        customerState,
        invoiceType,
      }),
    [items, orderDiscount, shopState, customerState, invoiceType],
  );

  // Mirror computed billing back into form state so submit picks it up.
  useEffect(() => {
    setValue("billing", {
      subTotal: computed.billing.subTotal,
      discounts: computed.billing.discounts,
      taxes: computed.billing.taxes,
      grandTotal: computed.billing.grandTotal,
      roundOff: computed.billing.roundOff,
      finalAmount: computed.billing.finalAmount,
    });
  }, [computed, setValue]);

  // Mirror enriched items (with computed taxes/totals) back into form state.
  // The check must include taxes structure too — switching customer state can
  // change CGST+SGST → IGST while leaving taxableValue/totalPrice unchanged,
  // and that mismatch would leak into the submitted payload.
  useEffect(() => {
    const sameTaxes = (a: typeof items[number]["taxes"], b: typeof a) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (
          a[i].type !== b[i].type ||
          a[i].rate !== b[i].rate ||
          a[i].amount !== b[i].amount
        )
          return false;
      }
      return true;
    };
    const same =
      items.length === computed.items.length &&
      items.every(
        (it, i) =>
          it.taxableValue === computed.items[i]?.taxableValue &&
          it.totalPrice === computed.items[i]?.totalPrice &&
          sameTaxes(it.taxes, computed.items[i]?.taxes ?? []),
      );
    if (!same) setValue("items", computed.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed]);

  const handleItemsChange = (updatedItems: OrderItemPopulated[]) => {
    setValue("items", updatedItems);
  };

  const [isOrderItemSelectModalOpen, setOrderItemSelectModalOpen] =
    useState(false);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ============ TOP: Order Details (full-width, 4-col grid) ============ */}
        <FormContainer title="Order Details">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <OrderMetaFields control={control} />
              <CustomerSelectSlot control={control} />
            </div>
            <CustomerInfoChip control={control} shopState={shopState} />
            <OrderDescriptionField control={control} />
          </div>
        </FormContainer>

        {/* ============ FULL-WIDTH: Order Items ============ */}
        <div className="dark:bg-gray-800 bg-white rounded-xl">
          <div className="px-4 py-2 flex justify-between items-center">
            <h2 className="text-sm dark:text-gray-100 text-gray-900">
              Order Items
            </h2>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOrderItemSelectModalOpen(true)}
            >
              Add Item
            </Button>
          </div>
          <hr className="dark:border-gray-600" />
          <div className="w-full p-4">
            <OrderItemList
              orderItems={items}
              computedLines={computed.lines}
              taxExempt={computed.billing.taxExempt}
              interState={computed.billing.interState}
              handleChange={handleItemsChange}
            />
          </div>
        </div>

        {/* ============ BOTTOM: Payment + Sticky Summary ============ */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7">
            <FormContainer title="Payment">
              <PaymentDetailsCard
                control={control}
                finalAmount={computed.billing.finalAmount}
                setValue={setValue as any}
              />
            </FormContainer>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-4">
              <InvoiceSummary
                computed={computed}
                orderDiscount={orderDiscount}
                onOrderDiscountChange={(v) => setValue("orderDiscount", v)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-6">
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || isSubmitting}
          >
            {isLoading ? "Saving…" : submitLabel}
          </Button>
        </div>
      </form>

      {isOrderItemSelectModalOpen && (
        <OrderItemSelectModal
          close={() => setOrderItemSelectModalOpen(false)}
          existingItems={items}
          onAdd={(newItems) => {
            handleItemsChange([
              ...items,
              ...newItems.filter(
                (i) =>
                  !items.some((ei) => ei.product._id === i.product._id),
              ),
            ]);
          }}
        />
      )}
    </>
  );
};
