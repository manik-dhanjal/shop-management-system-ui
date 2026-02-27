import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  OrderForm,
  OrderFormTypes,
} from "@features/order/components/order-form.component";
import { UpdateOrder } from "@features/order/interface/order.interface";
import { useGetOrder } from "@features/order/hooks/use-get-order.hook";
import { useUpdateOrder } from "@features/order/hooks/use-update-order.hook";
import { useShop } from "@shared/hooks/shop.hook";
import { OrderItem } from "@features/order/interface/order-item.interface";

export const EditOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { activeShop } = useShop();

  if (!orderId) {
    navigate("/404");
    return;
  }

  const { mutate } = useUpdateOrder();
  const existingOrder = useGetOrder(orderId);

  const handleSave = (order: OrderFormTypes) => {
    // Transform items from OrderItemPopulated to OrderItem
    const transformedItems: OrderItem[] = order.items.map((item) => ({
      ...item,
      product: item.product._id,
    }));

    const formattedOrder: UpdateOrder = {
      ...order,
      items: transformedItems,
      shop: activeShop._id,
      billing: {
        subTotal: order.billing.subTotal || 0,
        discounts: order.billing.discounts || 0,
        taxes: order.billing.taxes,
        grandTotal: order.billing.grandTotal || 0,
        roundOff: order.billing.roundOff || 0,
        finalAmount: order.billing.finalAmount || 0,
      },
      payment: {
        paymentMethod: order.payment.paymentMethod!,
        status: order.payment.status!,
        amountPaid: order.payment.amountPaid || 0,
        transactionId: order.payment.transactionId,
        notes: order.payment.notes,
        paymentDate: order.payment.paymentDate || new Date().toISOString(),
      },
    };
    mutate({ orderId, orderChanges: formattedOrder });
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
    <OrderForm
      isLoading={existingOrder.isPending}
      onSubmit={handleSave}
      initialOrderData={existingOrder.data}
    />
  );
};
