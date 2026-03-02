import React, { useState } from "react";
import TextBox from "@shared/components/form/text-box.component";
import Button from "@shared/components/form/button.component";
import LocationForm from "@shared/components/form/location-form.component";
import { Location } from "@shared/interfaces/location.interface";
import { CreateCustomer } from "../interface/customer.interface";

interface CustomerFormProps {
  formTitle: string;
  onSubmit: (customer: CreateCustomer) => void;
  initialFormValues?: Partial<CreateCustomer>;
  shopId: string;
}

const EMPTY_LOCATION: Location = {
  address: "",
  country: "",
  state: "",
  city: "",
  pinCode: "",
};

const getInitialValues = (
  shopId: string,
  initial?: Partial<CreateCustomer>,
): CreateCustomer => ({
  name: initial?.name ?? "",
  phone: initial?.phone ?? "",
  shop: shopId,
  email: initial?.email ?? "",
  profileImage: initial?.profileImage,
  shippingAddress: initial?.shippingAddress,
  billingAddress: initial?.billingAddress ?? { ...EMPTY_LOCATION },
  gstin: initial?.gstin ?? "",
});

const CustomerForm = ({
  formTitle,
  onSubmit,
  initialFormValues,
  shopId,
}: CustomerFormProps) => {
  const [form, setForm] = useState<CreateCustomer>(
    getInitialValues(shopId, initialFormValues),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBillingAddressChange = (location: Location) => {
    setForm({ ...form, billingAddress: location });
  };

  const handleShippingAddressChange = (location: Location) => {
    setForm({ ...form, shippingAddress: location });
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload: CreateCustomer = {
      ...form,
      email: form.email || undefined,
      gstin: form.gstin || undefined,
      shippingAddress:
        form.shippingAddress?.address ||
        form.shippingAddress?.city ||
        form.shippingAddress?.country
          ? form.shippingAddress
          : undefined,
    };
    onSubmit(payload);
  };

  return (
    <div className="flex gap-10">
      <div className="flex-1">
        <h2 className="text-2xl mb-6">{formTitle}</h2>
        <form>
          <TextBox
            label="Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="mb-5 max-w-[400px]"
            required
          />
          <TextBox
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            className="mb-5 max-w-[400px]"
            required
          />
          <TextBox
            label="Email (Optional)"
            name="email"
            value={form.email ?? ""}
            onChange={handleInputChange}
            className="mb-5 max-w-[400px]"
            type="email"
          />
          <TextBox
            label="GSTIN (Optional)"
            name="gstin"
            value={form.gstin ?? ""}
            onChange={handleInputChange}
            className="mb-5 max-w-[400px]"
          />
          <LocationForm
            onChange={handleBillingAddressChange}
            values={form.billingAddress}
            title="Billing Address"
            className="mb-8 max-w-[400px]"
          />
          <LocationForm
            onChange={handleShippingAddressChange}
            values={form.shippingAddress ?? { ...EMPTY_LOCATION }}
            title="Shipping Address (Optional)"
            className="mb-8 max-w-[400px]"
          />
          <Button type="submit" onClick={handleSave} className="btn-lg">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
