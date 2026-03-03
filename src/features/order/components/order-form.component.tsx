import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import { FormContainer } from "@shared/components/form-container.component";
import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { PaymentMethod } from "@shared/enums/payment-method.enum";
import { PaymentStatus } from "@shared/enums/payment-status.enum";
import { OrderItemList } from "./order-item-list.component";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { Button } from "@mui/material";
import { OrderItemSelectModal } from "./order-item-select-modal.component";
import { useState } from "react";
import { Order } from "../interface/order.interface";
import { BillingDetails } from "../interface/billing-details.interface";
import { PaymentDetails } from "../interface/payment-details.interface";
import {
  CustomerSelect,
  CustomerSelectControlled,
} from "@features/customer/components/customer-select.component";

export interface OrderFormTypes extends Partial<
  Omit<
    Order,
    "billing" | "payment" | "shop" | "createdAt" | "updatedAt" | "__v" | "items"
  >
> {
  billing: Partial<BillingDetails>;
  payment: Partial<PaymentDetails>;
  items: OrderItemPopulated[];
}

interface OrderFormProps {
  onSubmit: SubmitHandler<OrderFormTypes>;
  isLoading: boolean;
  initialOrderData?: Partial<OrderFormTypes>;
}

export const INITIAL_FORM_VALUES: OrderFormTypes = {
  invoiceId: undefined,
  customer: undefined,
  invoiceType: InvoiceType.TAX_INVOICE,
  items: [],
  description: undefined,
  billing: {
    subTotal: undefined,
    discounts: undefined,
    grandTotal: undefined,
    roundOff: undefined,
    finalAmount: undefined,
  },
  payment: {
    paymentMethod: PaymentMethod.CASH,
    status: undefined,
    amountPaid: undefined,
    paymentDate: new Date().toISOString(),
  },
};

const schema = yup.object({
  invoiceId: yup.string().required("Invoice id is required"),
  customer: yup.string().required("Customer is required"),
  invoiceType: yup
    .mixed<InvoiceType>()
    .oneOf(Object.values(InvoiceType))
    .required("Invoice type is required"),
  items: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Product id is required"),
        value: yup
          .number()
          .typeError("Quantity must be a number")
          .min(0, "Quantity cannot be negative"),
      }),
    )
    .min(1, "At least one item is required"),
  description: yup.string(),
  billing: yup.object({
    subTotal: yup.number().required(),
    discounts: yup.number().required(),
    grandTotal: yup.number().required(),
    roundOff: yup.number().required(),
    finalAmount: yup.number().required(),
  }),
  payment: yup.object({
    paymentMethod: yup
      .mixed<PaymentMethod>()
      .oneOf(Object.values(PaymentMethod))
      .required("Payment method is required"),
    status: yup
      .mixed<PaymentStatus>()
      .oneOf(Object.values(PaymentStatus))
      .required("Payment status is required"),
    amountPaid: yup.number().required("Amount paid is required"),
    transactionId: yup.string(),
    notes: yup.string(),
    paymentDate: yup.string().required("Payment date is required"),
  }),
});

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  initialOrderData,
}) => {
  const resolver = useYupValidationResolver(schema);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {},
  } = useForm<OrderFormTypes>({
    defaultValues: initialOrderData || INITIAL_FORM_VALUES,
    resolver,
  });

  // bridge TableInput changes into react-hook-form
  const itemsValue = watch("items");
  const handleItemsChange = (updatedItems: OrderItemPopulated[]) => {
    setValue("items", updatedItems);
  };
  const [isOrderItemSelectModalOpen, setOrderItemSelectModalOpen] =
    useState(false);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
        <div className="w-1/3">
          <FormContainer title="Order Details" className="mb-4">
            <TextFieldControlled
              label="Invoice ID"
              name="invoiceId"
              control={control}
              className="mb-5 w-full"
              required
            />
            <CustomerSelectControlled control={control} name="customer" />
          </FormContainer>
          <FormContainer title="Billing Address" className="mb-4" collapsible>
            cd
          </FormContainer>
          <FormContainer title="Shipping Address" className="mb-4" collapsible>
            cd
          </FormContainer>
        </div>
        <div className="w-2/3">
          <div className="dark:bg-gray-800 bg-white  rounded-xl">
            <div className="px-4 py-2 flex justify-between items-center">
              <h2 className="text-sm dark:text-gray-100 text-gray-900">
                Order Items
              </h2>
              <Button
                variant="outlined"
                size="small"
                className="ml-auto"
                onClick={() => setOrderItemSelectModalOpen(true)}
              >
                Add Item
              </Button>
            </div>

            <hr className=" dark:border-gray-600" />
            <div className="w-full p-4">
              <OrderItemList
                orderItems={itemsValue}
                handleChange={handleItemsChange}
              />
            </div>
          </div>
        </div>
      </form>
      {isOrderItemSelectModalOpen && (
        <OrderItemSelectModal
          close={() => setOrderItemSelectModalOpen(false)}
          existingItems={itemsValue}
          onAdd={(newItems) => {
            // merge existing with newly selected items
            handleItemsChange([
              ...itemsValue,
              ...newItems.filter(
                (i) =>
                  !itemsValue.some((ei) => ei.product._id === i.product._id),
              ),
            ]);
          }}
        />
      )}
    </>
  );
};
