import { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  OrderForm,
  OrderFormTypes,
} from "@features/order/components/order-form.component";
import { UpdateOrder } from "@features/order/interface/order.interface";
import { useGetOrderPopulated } from "@features/order/hooks/use-get-order-populated.hook";
import { useUpdateOrder } from "@features/order/hooks/use-update-order.hook";
import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { PaymentMethod } from "@shared/enums/payment-method.enum";
import { PaymentStatus } from "@shared/enums/payment-status.enum";
import { useShop } from "@shared/hooks/shop.hook";
import {
  OrderItem,
  OrderItemPopulated,
} from "@features/order/interface/order-item.interface";

export const EditOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { activeShop } = useShop();

  if (!orderId) {
    navigate("/404");
    return null;
  }

  const { mutate, isPending } = useUpdateOrder();
  const existingOrder = useGetOrderPopulated(orderId);

  // The populated endpoint returns `customer` as a Customer object and
  // `items[].product` as a Product object. The form expects `customer` to be
  // a plain id string and `items[]` to be `OrderItemPopulated[]`, which is
  // already the populated shape — so we just need to flatten the customer.
  const initialOrderData = useMemo<Partial<OrderFormTypes> | undefined>(() => {
    const o: any = existingOrder.data;
    if (!o) return undefined;
    return {
      ...o,
      customer:
        o.customer && typeof o.customer === "object"
          ? o.customer._id
          : o.customer,
      items: (o.items as OrderItemPopulated[]) || [],
    };
  }, [existingOrder.data]);

  const handleSave = (order: OrderFormTypes) => {
    const transformedItems: OrderItem[] = order.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      discount: item.discount,
      taxableValue: item.taxableValue,
      taxes: item.taxes,
      totalPrice: item.totalPrice,
    }));

    const formatted: UpdateOrder = {
      invoiceId: order.invoiceId || "",
      customer: order.customer || "",
      invoiceType: order.invoiceType || InvoiceType.TAX_INVOICE,
      items: transformedItems,
      shop: activeShop._id,
      description: order.description,
      billing: {
        subTotal: order.billing.subTotal ?? 0,
        discounts: order.billing.discounts ?? 0,
        taxes: order.billing.taxes ?? [],
        grandTotal: order.billing.grandTotal ?? 0,
        roundOff: order.billing.roundOff ?? 0,
        finalAmount: order.billing.finalAmount ?? 0,
      },
      payment: {
        paymentMethod: order.payment.paymentMethod ?? PaymentMethod.CASH,
        status: order.payment.status ?? PaymentStatus.PENDING,
        amountPaid: order.payment.amountPaid ?? 0,
        transactionId: order.payment.transactionId,
        notes: order.payment.notes,
        paymentDate: order.payment.paymentDate ?? new Date().toISOString(),
      },
    };
    mutate({ orderId, orderChanges: formatted });
  };

  if (existingOrder.isLoading)
    return (
      <div className="flex flex-col gap-5 items-center justify-center">
        <CircularProgress />
        <div>Loading order details...</div>
      </div>
    );

  if (!existingOrder.data || existingOrder.isError)
    return (
      <div className="flex flex-col gap-5 items-center justify-center">
        <div>Unable to load order details</div>
      </div>
    );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Edit Order
        </h1>
      </div>
      <OrderForm
        isLoading={isPending}
        onSubmit={handleSave}
        initialOrderData={initialOrderData}
        submitLabel="Update Order"
      />
    </div>
  );
};
