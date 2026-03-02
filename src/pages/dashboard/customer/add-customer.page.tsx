import { useAddCustomer } from "@features/customer/hooks/use-add-customer.hook";
import CustomerForm from "@features/customer/components/customer-form.component";
import { CreateCustomer } from "@features/customer/interface/customer.interface";
import { useShop } from "@shared/hooks/shop.hook";

export const AddCustomerPage = () => {
  const { mutate } = useAddCustomer();
  const { activeShop } = useShop();

  const handleSave = (customer: CreateCustomer) => {
    mutate(customer);
  };

  return (
    <CustomerForm
      formTitle="Add New Customer"
      onSubmit={handleSave}
      shopId={activeShop._id}
    />
  );
};
