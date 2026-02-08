import { OrderForm } from "@features/order/components/order-form.component";

export const AddOrderPage = () => {
  const handleSubmit = () => {
    console.log();
  };
  return <OrderForm formTitle="Add Order" onSubmit={handleSubmit} />;
};
