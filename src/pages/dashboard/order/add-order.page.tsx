import { useNavigate } from "react-router-dom";
import { useAddOrder } from "@features/order/hooks/use-add-order.hook";
import {
  OrderForm,
  OrderFormTypes,
} from "@features/order/components/order-form.component";
import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { PaymentMethod } from "@shared/enums/payment-method.enum";
import { PaymentStatus } from "@shared/enums/payment-status.enum";
import { useShop } from "@shared/hooks/shop.hook";
import { OrderItem } from "@features/order/interface/order-item.interface";
import { CreateOrder } from "@features/order/interface/order.interface";

const AddOrderPage = () => {
  const { mutate, isPending } = useAddOrder();
  const { activeShop } = useShop();
  const navigate = useNavigate();

  const handleSave = (order: OrderFormTypes) => {
    const transformedItems: OrderItem[] = order.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      discount: item.discount,
      taxableValue: item.taxableValue,
      taxes: item.taxes,
      totalPrice: item.totalPrice,
    }));

    const formatted: CreateOrder = {
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

    mutate(formatted, {
      onSuccess: (created) => {
        navigate(`/dashboard/order/${created._id}/print`);
      },
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          New Order
        </h1>
      </div>
      <OrderForm onSubmit={handleSave} isLoading={isPending} />
    </div>
  );
};

export default AddOrderPage;
