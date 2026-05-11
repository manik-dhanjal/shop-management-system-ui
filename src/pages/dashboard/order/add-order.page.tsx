import { useAddOrder } from "@features/order/hooks/use-add-order.hook";
import {
  OrderForm,
  OrderFormTypes,
} from "@features/order/components/order-form.component";
import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { useShop } from "@shared/hooks/shop.hook";
import { OrderItem } from "@features/order/interface/order-item.interface";
import { CreateOrder } from "@features/order/interface/order.interface";
const AddOrderPage = () => {
  const { mutate, isPending } = useAddOrder();
  const { activeShop } = useShop();

  const handleSave = (order: OrderFormTypes) => {
    // Transform items from OrderItemPopulated to OrderItem
    const transformedItems: OrderItem[] = order.items.map((item) => ({
      ...item,
      product: item.product._id,
    }));

    const formattedOrder: CreateOrder = {
      ...order,
      invoiceId: order.invoiceId || "",
      customer: order.customer || "",
      invoiceType: order.invoiceType || InvoiceType.TAX_INVOICE,
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
    mutate(formattedOrder);
  };

  return (
    <div>
      <OrderForm onSubmit={handleSave} isLoading={isPending} />
    </div>
  );
};

export default AddOrderPage;
