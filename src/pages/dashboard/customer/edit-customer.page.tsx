import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomerForm from "@features/customer/components/customer-form.component";
import { UpdateCustomer } from "@features/customer/interface/customer.interface";
import { useGetCustomer } from "@features/customer/hooks/use-get-customer.hook";
import { useUpdateCustomer } from "@features/customer/hooks/use-update-customer.hook";
import { useShop } from "@shared/hooks/shop.hook";

export const EditCustomerPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { activeShop } = useShop();
  const existingCustomer = useGetCustomer(customerId ?? "");
  const { mutate } = useUpdateCustomer(customerId ?? "");

  if (!customerId) {
    navigate("/404");
    return null;
  }

  const handleSave = (customer: UpdateCustomer) => {
    mutate(customer);
  };

  if (existingCustomer.isLoading)
    return (
      <div className="flex flex-col gap-5 items-center justify-center">
        <CircularProgress />
        <div>Loading customer details...</div>
      </div>
    );

  if (!existingCustomer.data || existingCustomer.isError)
    return (
      <div className="flex flex-col gap-5 items-center justify-center">
        <div>Unable to load customer details</div>
      </div>
    );

  return (
    <CustomerForm
      formTitle="Edit Customer"
      onSubmit={handleSave}
      shopId={activeShop._id}
      initialFormValues={existingCustomer.data}
    />
  );
};
