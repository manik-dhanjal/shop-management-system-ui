import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import { CustomerFormTypes } from "@features/customer/interface/customer.interface";
import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { PhoneFieldControlled } from "@shared/components/form/phone-field-controlled.component";
import Button from "@shared/components/form/button.component";
import { CountrySelectControlled } from "@shared/components/form/country-select-controlled.component";

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
  email: yup.string().email("Email is not valid").optional(),
  billingAddress: yup
    .object({
      address: yup.string(),
      country: yup.string(),
      state: yup.string(),
      city: yup.string(),
      pinCode: yup.string(),
    })
    .nullable()
    .optional(),
  shippingAddress: yup
    .object({
      address: yup.string(),
      country: yup.string(),
      state: yup.string(),
      city: yup.string(),
      pinCode: yup.string(),
    })
    .nullable()
    .optional(),

  gstin: yup
    .string()
    .test("valid-gstin", "Invalid GSTIN format", function (value) {
      if (!value) return true; // Allow empty GSTIN
      return GSTIN_PATTERN.test(value);
    }),
});

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  isLoading = false,
  initialCustomerData,
}) => {
  const resolver = useYupValidationResolver(schema);

  const { control, handleSubmit, watch, setValue } = useForm<CustomerFormTypes>(
    {
      defaultValues: initialCustomerData || INITIAL_FORM_VALUES,
      resolver,
    },
  );

  const [addBillingAddress, setAddBillingAddress] = useState(
    !!initialCustomerData?.billingAddress,
  );
  const [addShippingAddress, setAddShippingAddress] = useState(
    !!initialCustomerData?.shippingAddress,
  );
  const watchAllFields = watch();

  useEffect(() => {
    if (!addBillingAddress) {
      setValue("billingAddress", undefined);
    }
  }, [addBillingAddress, setValue]);

  useEffect(() => {
    if (!addShippingAddress) {
      setValue("shippingAddress", undefined);
    }
  }, [addShippingAddress, setValue]);

  // Clean up empty address objects before submission
  const cleanupAddressData = (data: CustomerFormTypes) => {
    const cleanedData = { ...data };

    // Remove billingAddress if it's empty or has no meaningful data
    if (
      !addBillingAddress ||
      !cleanedData.billingAddress ||
      Object.values(cleanedData.billingAddress).every((v) => !v)
    ) {
      cleanedData.billingAddress = undefined;
    }

    // Remove shippingAddress if it's empty or has no meaningful data
    if (
      !addShippingAddress ||
      !cleanedData.shippingAddress ||
      Object.values(cleanedData.shippingAddress).every((v) => !v)
    ) {
      cleanedData.shippingAddress = undefined;
    }

    if (cleanedData.gstin === "") {
      cleanedData.gstin = undefined;
    }
    if (cleanedData.email === "") {
      cleanedData.email = undefined;
    }

    return cleanedData;
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit((data) => {
          const cleanedData = cleanupAddressData(data);
          onSubmit(cleanedData);
        })();
      }}
      className="space-y-4"
    >
      <div className="max-h-[calc(100vh-250px)] overflow-y-auto py-2">
        <div>
          {/* Customer Details */}
          <TextFieldControlled
            label="Customer Name *"
            name="name"
            control={control}
            className="mb-5 w-full"
            required
          />
          <PhoneFieldControlled
            name="phone"
            control={control}
            label="Phone *"
            defaultCountry="IN"
            className="w-full mb-5"
            placeholder="Enter your phone number"
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

          {/* Billing Address */}
          <div className="flex items-center gap-2 mb-3 mt-5">
            <Checkbox
              style={{
                padding: 0,
              }}
              checked={addBillingAddress}
              onChange={(e) => setAddBillingAddress(e.target.checked)}
              id="add-billing-address-checkbox"
            />
            <label
              htmlFor="add-billing-address-checkbox"
              className="cursor-pointer"
            >
              Add Billing Address
            </label>
          </div>

          {(addBillingAddress || watchAllFields.billingAddress) && (
            <>
              <TextFieldControlled
                label="Billing Address"
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
                />
                <TextFieldControlled
                  label="State"
                  name="billingAddress.state"
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CountrySelectControlled
                  label="Country"
                  name="billingAddress.country"
                  control={control}
                />
                <TextFieldControlled
                  label="Pin Code"
                  name="billingAddress.pinCode"
                  control={control}
                />
              </div>
            </>
          )}

          {/* Shipping Address (Optional) */}
          <div className="flex items-center gap-2  mt-5">
            <Checkbox
              style={{
                padding: 0,
              }}
              checked={addShippingAddress}
              onChange={(e) => setAddShippingAddress(e.target.checked)}
              id="add-shipping-address-checkbox"
            />
            <label
              htmlFor="add-shipping-address-checkbox"
              className="cursor-pointer"
            >
              Add Shipping Address
            </label>
          </div>
          {(addShippingAddress || watchAllFields.shippingAddress) && (
            <>
              <TextFieldControlled
                label="Address"
                name="shippingAddress.address"
                control={control}
                className="mb-5 w-full mt-3"
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
                <CountrySelectControlled
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
            </>
          )}
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end gap-3 mt-6">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Customer"}
        </Button>
      </div>
    </form>
  );
};
