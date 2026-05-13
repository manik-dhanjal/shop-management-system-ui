import { useNavigate } from "react-router-dom";
import { CustomerForm } from "@features/customer/components/customer-form.component";
import { useAddCustomer } from "@features/customer/hooks/use-add-customer.hook";
import { CustomerFormTypes } from "@features/customer/interface/customer.interface";

export const AddCustomerPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useAddCustomer();

  const handleSave = (data: CustomerFormTypes) => {
    mutate(data, {
      onSuccess: (created) => navigate(`/dashboard/customer/${created._id}`),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          New Customer
        </h1>
        <button
          onClick={() => navigate("/dashboard/customer/all")}
          className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          ← Back to customers
        </button>
      </div>
      <CustomerForm onSubmit={handleSave} isLoading={isPending} />
    </div>
  );
};

export default AddCustomerPage;
