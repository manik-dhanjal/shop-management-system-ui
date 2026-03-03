import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import { FormContainer } from "@shared/components/form-container.component";
import { CustomerFormTypes } from "@features/customer/interface/customer.interface";

interface CustomerFormProps {
  onSubmit: SubmitHandler<CustomerFormTypes>;
  isLoading?: boolean;
  initialCustomerData?: CustomerFormTypes;
}

export const INITIAL_FORM_VALUES: CustomerFormTypes = {
  name: "",
  phone: "",
  email: "",
  profileImage: undefined,
  billingAddress: undefined,
  shippingAddress: undefined,
  gstin: "",
};

// GSTIN regex pattern: 2 digits, 5 uppercase letters, 4 digits, 1 uppercase letter, 1 alphanumeric (not 0), Z, 1 alphanumeric
const GSTIN_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

const schema = yup.object({
  name: yup.string().required("Customer name is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").optional(),
  billingAddress: yup
    .object({
      address: yup.string().required("Billing address is required"),
      country: yup.string().required("Country is required"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      pinCode: yup.string().required("Pin code is required"),
    })
    .optional(),
  shippingAddress: yup
    .object({
      address: yup.string().required("Shipping address is required"),
      country: yup.string().required("Country is required"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      pinCode: yup.string().required("Pin code is required"),
    })
    .optional(),
  gstin: yup.string().optional().matches(GSTIN_PATTERN, "Invalid GSTIN format"),
});

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  isLoading = false,
  initialCustomerData,
}) => {
  const resolver = useYupValidationResolver(schema);

  const { control, handleSubmit } = useForm<CustomerFormTypes>({
    defaultValues: initialCustomerData || INITIAL_FORM_VALUES,
    resolver,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Customer Details */}
      <FormContainer title="Customer Details" className="mb-4">
        <TextFieldControlled
          label="Customer Name"
          name="name"
          control={control}
          className="mb-5 w-full"
          required
        />
        <TextFieldControlled
          label="Phone Number"
          name="phone"
          control={control}
          className="mb-5 w-full"
          required
        />
        <TextFieldControlled
          label="Email"
          name="email"
          control={control}
          className="mb-5 w-full"
          type="email"
        />
        <TextFieldControlled
          label="GSTIN"
          name="gstin"
          control={control}
          className="w-full"
          placeholder="27AAACX1234B1Z1"
        />
      </FormContainer>

      {/* Billing Address */}
      <FormContainer
        title="Billing Address"
        className="mb-4"
        collapsible
        defaultOpen={!!initialCustomerData?.billingAddress}
      >
        <TextFieldControlled
          label="Address"
          name="billingAddress.address"
          control={control}
          className="mb-5 w-full"
          required
          multiline
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4 mb-5">
          <TextFieldControlled
            label="City"
            name="billingAddress.city"
            control={control}
            required
          />
          <TextFieldControlled
            label="State"
            name="billingAddress.state"
            control={control}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextFieldControlled
            label="Country"
            name="billingAddress.country"
            control={control}
            required
          />
          <TextFieldControlled
            label="Pin Code"
            name="billingAddress.pinCode"
            control={control}
            required
          />
        </div>
      </FormContainer>

      {/* Shipping Address (Optional) */}
      <FormContainer
        title="Shipping Address (Optional)"
        className="mb-4"
        collapsible
        defaultOpen={!!initialCustomerData?.shippingAddress}
      >
        <TextFieldControlled
          label="Address"
          name="shippingAddress.address"
          control={control}
          className="mb-5 w-full"
          multiline
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4 mb-5">
          <TextFieldControlled
            label="City"
            name="shippingAddress.city"
            control={control}
          />
          <TextFieldControlled
            label="State"
            name="shippingAddress.state"
            control={control}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextFieldControlled
            label="Country"
            name="shippingAddress.country"
            control={control}
          />
          <TextFieldControlled
            label="Pin Code"
            name="shippingAddress.pinCode"
            control={control}
          />
        </div>
      </FormContainer>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Saving..." : "Save Customer"}
        </button>
      </div>
    </form>
  );
};
