import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { CustomerForm } from "@features/customer/components/customer-form.component";
import { useGetCustomer } from "@features/customer/hooks/use-get-customer.hook";
import { useUpdateCustomer } from "@features/customer/hooks/use-update-customer.hook";
import { CustomerFormTypes } from "@features/customer/interface/customer.interface";

export const EditCustomerPage = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { data, isLoading, isError } = useGetCustomer(customerId || "");
  const { mutate, isPending } = useUpdateCustomer();

  if (!customerId) {
    navigate("/404");
    return null;
  }

  if (isLoading)
    return (
      <div className="flex flex-col gap-5 items-center justify-center py-16">
        <CircularProgress />
        <div>Loading customer…</div>
      </div>
    );
  if (isError || !data)
    return <div className="p-6 text-red-600">Unable to load customer</div>;

  const handleSave = (form: CustomerFormTypes) => {
    mutate(
      { customerId, payload: form },
      { onSuccess: () => navigate(`/dashboard/customer/${customerId}`) },
    );
  };

  // The API returns the profileImage as either an id string or a populated
  // image object; flatten to id so the form's hidden field stays primitive.
  const initial: Partial<CustomerFormTypes> = {
    ...(data as any),
    profileImage:
      data.profileImage && typeof data.profileImage === "object"
        ? (data.profileImage as any)._id
        : (data.profileImage as any),
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Edit Customer
        </h1>
        <button
          onClick={() => navigate(`/dashboard/customer/${customerId}`)}
          className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          ← Back to customer
        </button>
      </div>
      <CustomerForm
        onSubmit={handleSave}
        isLoading={isPending}
        initialCustomerData={initial}
        submitLabel="Update Customer"
      />
    </div>
  );
};

export default EditCustomerPage;
