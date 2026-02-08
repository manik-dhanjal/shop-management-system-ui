import { OrderItemList } from "@features/order/components/order-item-list.component";
import OrderSummary from "@features/order/components/order-summary.components";
import OrderTaxes from "@features/order/components/order-taxes.components";
import { OrderItemPopulated } from "@features/order/interface/order-item.interface";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { CountrySelectControlled } from "@shared/components/form/country-select-controlled.component";
import { PhoneFieldControlled } from "@shared/components/form/phone-field-controlled.component";
import { TextFieldControlled } from "@shared/components/form/text-field-controlled.component";
import SectionBlock from "@shared/components/section-block";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import { Location } from "@shared/interfaces/location.interface";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StateSelectControlled } from "@shared/components/form/state-select-controlled.component";
import * as yup from "yup";
import { useAuth } from "@shared/hooks/auth.hooks";

export interface OrderFormTypes {
  customer: {
    name: string;
    phone: string;
    email?: string;
    gstin?: string;
    billingAddress: Location;
    shippingAddress?: Location;
  };
  items: OrderItemPopulated[];
  billing: {
    discounts: number;
    roundOff: number;
  };
}

export const INITIAL_FORM_VALUES: OrderFormTypes = {
  customer: {
    name: "",
    phone: "",
    email: "",
    gstin: "",
    billingAddress: {
      address: "",
      country: "India",
      state: "",
      city: "",
      pinCode: "",
    },
  },
  items: [],
  billing: {
    discounts: 0,
    roundOff: 0,
  },
};

interface OrderFormProps {
  formTitle: string;
  initialFormValues?: OrderFormTypes;
  onSubmit: (product: OrderFormTypes) => void;
}
export const OrderForm = ({
  formTitle,
  initialFormValues,
  onSubmit,
}: OrderFormProps) => {
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        customer: yup.object().shape({
          name: yup
            .string()
            .required("Customer Name is required")
            .matches(/^[a-zA-Z]+$/, "First Name should only contain letters"),
          phone: yup.string().required("Phone number is required"),
          email: yup.string().optional().email("Email is not valid"),
          billingAddress: yup.object().shape({
            address: yup.string().required("Address is required"),
            country: yup.string().required("Country is required"),
            state: yup.string().required("State is required"),
            city: yup.string().required("City is required"),
            pinCode: yup
              .string()
              .required("Pincode is required")
              .matches(/^[0-9]{6}$/, {
                message: "Pincode should be 6 digits",
                excludeEmptyString: true,
              }),
          }),
        }),
        billing: yup.object().shape({
          discounts: yup.number().positive().integer().default(0),
          roundOff: yup.number().positive().integer().default(0),
        }),
      }),
    [],
  );
  const [addShippingAddress, setAddShippingAddress] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItemPopulated[]>([]);
  const auth = useAuth();
  const resolver = useYupValidationResolver(validationSchema);
  const { control, handleSubmit, watch, setValue } = useForm<OrderFormTypes>({
    resolver,
    defaultValues: initialFormValues || {
      ...INITIAL_FORM_VALUES,
      customer: {
        ...INITIAL_FORM_VALUES.customer,
        billingAddress: {
          ...INITIAL_FORM_VALUES.customer.billingAddress,
          country: auth.activeShop?.location.country || "",
          state: auth.activeShop?.location.state || "",
          pinCode: auth.activeShop?.location.pinCode || "",
          address: auth.activeShop?.location.address || "",
          city: auth.activeShop?.location.city || "",
        },
      },
    },
  });
  const billingCountry = watch("customer.billingAddress.country");
  const shippingCountry = watch("customer.shippingAddress.country");
  const billingState = watch("customer.billingAddress.state");
  const shippingState = watch("customer.shippingAddress.state");

  useEffect(() => {
    if (!billingCountry)
      setValue("customer.billingAddress.state", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
  }, [billingCountry, setValue]);
  useEffect(() => {
    if (!shippingCountry)
      setValue("customer.shippingAddress.state", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
  }, [shippingCountry, setValue]);

  const onFormSubmit = (data: OrderFormTypes) => {
    console.log({ ...data, items: orderItems });
    onSubmit(data);
  };

  // Watch for changes in billing.discounts and billing.roundOff

  return (
    <>
      <h2>{formTitle}</h2>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex justify-start items-center gap-4">
            <label className="dark:text-white  text-slate-900">
              Invoice ID:
            </label>
            <TextField
              variant="standard"
              className="w-[100px]"
              placeholder="#1001"
              prefix="#"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
          >
            Save Order
          </Button>
        </div>

        <div className="flex gap-10">
          {/* Right Side of Form */}
          <div className="max-w-[360px] w-full flex flex-col gap-8">
            {/* customer details */}
            <SectionBlock title="Customer Details:" className="w-full">
              <div className="flex gap-6 flex-col">
                <TextFieldControlled
                  name="customer.name"
                  control={control}
                  label="Name"
                  className="w-full"
                  placeholder="Enter customer name"
                  required={true}
                />

                <PhoneFieldControlled
                  name="customer.phone"
                  control={control}
                  label="Phone"
                  defaultCountry="IN"
                  className="w-full"
                  placeholder="Enter your phone number"
                />
                <TextFieldControlled
                  name="customer.gstin"
                  control={control}
                  label="GSTIN (Optional)"
                  className="w-full"
                  placeholder="Enter your GST Number"
                  required={false}
                />
                <TextFieldControlled
                  name="customer.email"
                  control={control}
                  label="Email (Optional)"
                  className="w-full"
                  placeholder="Enter your email"
                  required={false}
                />
              </div>
            </SectionBlock>
            {/* billing address */}
            <SectionBlock title="Billing Address:">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 w-full">
                <TextFieldControlled
                  name="customer.billingAddress.address"
                  control={control}
                  label="Address"
                  className="w-full col-span-2"
                  placeholder="Enter your address"
                />

                <TextFieldControlled
                  name="customer.billingAddress.city"
                  control={control}
                  label="City"
                  className="w-full"
                  placeholder="Enter your city"
                />
                <StateSelectControlled
                  name="customer.billingAddress.state"
                  control={control}
                  label="State"
                  className="w-full"
                  country={billingCountry}
                />

                <CountrySelectControlled
                  name="customer.billingAddress.country"
                  control={control}
                  label="Country"
                  defaultCountry="India"
                  className="w-full"
                />
                <TextFieldControlled
                  name="customer.billingAddress.pinCode"
                  control={control}
                  label="Pincode"
                  className="w-full"
                  placeholder="Enter your pincode"
                />
                <FormControlLabel
                  className="w-full col-span-2"
                  control={
                    <Checkbox
                      checked={addShippingAddress}
                      onChange={(e) => setAddShippingAddress(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Shipping Address same as a Billing Address"
                />
              </div>
            </SectionBlock>
            {!addShippingAddress && (
              <SectionBlock title="Shipping Address:">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 w-full">
                  <TextFieldControlled
                    name="customer.shippingAddress.address"
                    control={control}
                    label="Address"
                    className="w-full col-span-2"
                    placeholder="Enter your address"
                  />

                  <TextFieldControlled
                    name="customer.shippingAddress.city"
                    control={control}
                    label="City"
                    className="w-full"
                    placeholder="Enter your city"
                  />
                  <StateSelectControlled
                    name="customer.shippingAddress.state"
                    control={control}
                    label="State"
                    className="w-full"
                    country={shippingCountry}
                  />

                  <CountrySelectControlled
                    name="customer.shippingAddress.country"
                    control={control}
                    label="Country"
                    defaultCountry="India"
                    className="w-full"
                  />
                  <TextFieldControlled
                    name="customer.shippingAddress.pinCode"
                    control={control}
                    label="Pincode"
                    className="w-full"
                    placeholder="Enter your pincode"
                  />
                </div>
              </SectionBlock>
            )}
          </div>

          <div className="w-full  flex flex-col gap-8 items-start">
            <OrderItemList
              orderItems={orderItems}
              shippingCountry={shippingCountry || billingCountry}
              shippingState={shippingState || billingState}
              onOrderItemsChange={(newItems) => setOrderItems(newItems)}
            />
            <div className="flex gap-5 w-full items-start">
              <OrderTaxes />
              <OrderSummary control={control} orderItems={orderItems} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
