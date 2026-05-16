import { useEffect, useMemo } from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
  useFieldArray,
} from "react-hook-form";
import * as yup from "yup";
import { Button, IconButton } from "@mui/material";
import { IoAdd, IoTrash } from "react-icons/io5";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import SelectFieldControlled from "@shared/components/form/select-field-controlled.component";
import DateFieldControlled from "@shared/components/form/date-field-controlled.component";
import { PhoneFieldControlled } from "@shared/components/form/phone-field-controlled.component";
import { CountrySelectControlled } from "@shared/components/form/country-select-controlled.component";
import { FormContainer } from "@shared/components/form-container.component";
import { CustomerFormTypes } from "@features/customer/interface/customer.interface";
import { CustomerType } from "@shared/enums/customer-type.enum";
import { CustomerStatus } from "@shared/enums/customer-status.enum";
import {
  GstRegistrationType,
  GstRegistrationTypeLabel,
} from "@shared/enums/gst-registration-type.enum";
import {
  PaymentTerms,
  PaymentTermsLabel,
} from "@shared/enums/payment-terms.enum";
import {
  CustomerSource,
  CustomerSourceLabel,
} from "@shared/enums/customer-source.enum";
import { usePreviewCustomerCode } from "../hooks/use-preview-customer-code.hook";

interface CustomerFormProps {
  onSubmit: SubmitHandler<CustomerFormTypes>;
  isLoading?: boolean;
  initialCustomerData?: Partial<CustomerFormTypes>;
  submitLabel?: string;
  /**
   * Compact layout for the in-order quick-add modal: identity & contact stay
   * open, every other section is collapsible and starts collapsed.
   */
  compact?: boolean;
}

export const INITIAL_FORM_VALUES: CustomerFormTypes = {
  customerCode: undefined,
  name: "",
  legalName: "",
  type: CustomerType.INDIVIDUAL,
  status: CustomerStatus.ACTIVE,
  phone: "",
  alternatePhones: [],
  email: "",
  alternateEmails: [],
  contactPersonName: "",
  contactPersonDesignation: "",
  contactPersons: [],
  profileImage: undefined,
  gstRegistrationType: GstRegistrationType.CONSUMER,
  gstin: "",
  pan: "",
  placeOfSupplyStateCode: "",
  taxInvoicePreference: undefined,
  reverseChargeApplicable: false,
  isExempt: false,
  billingAddress: undefined,
  shippingAddresses: [],
  shippingAddress: undefined,
  creditLimit: 0,
  creditPeriodDays: 0,
  paymentTerms: PaymentTerms.IMMEDIATE,
  openingBalance: 0,
  discountPercentDefault: 0,
  currency: "INR",
  tags: [],
  notes: "",
  birthday: undefined,
  anniversary: undefined,
  source: CustomerSource.WALK_IN,
};

const GSTIN_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const schema = yup.object({
  name: yup.string().required("Display name is required"),
  legalName: yup.string().optional(),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Email is not valid").optional(),
  gstin: yup
    .string()
    .test("valid-gstin", "Invalid GSTIN format", (v) =>
      v ? GSTIN_PATTERN.test(v) : true,
    ),
  pan: yup
    .string()
    .test("valid-pan", "Invalid PAN format", (v) =>
      v ? PAN_PATTERN.test(v) : true,
    ),
  placeOfSupplyStateCode: yup
    .string()
    .test("two-digit", "Must be 2 digits", (v) =>
      v ? /^[0-9]{2}$/.test(v) : true,
    ),
});

const gstTypeOptions = Object.values(GstRegistrationType).map((v) => ({
  label: GstRegistrationTypeLabel[v],
  value: v,
}));
const paymentTermsOptions = Object.values(PaymentTerms).map((v) => ({
  label: PaymentTermsLabel[v],
  value: v,
}));
const sourceOptions = Object.values(CustomerSource).map((v) => ({
  label: CustomerSourceLabel[v],
  value: v,
}));

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  isLoading = false,
  initialCustomerData,
  submitLabel = "Save Customer",
  compact = false,
}) => {
  const resolver = useYupValidationResolver(schema);

  const defaults = useMemo<CustomerFormTypes>(
    () =>
      initialCustomerData
        ? ({
            ...INITIAL_FORM_VALUES,
            ...initialCustomerData,
          } as CustomerFormTypes)
        : INITIAL_FORM_VALUES,
    [initialCustomerData],
  );

  const { control, handleSubmit, setValue } = useForm<CustomerFormTypes>({
    defaultValues: defaults,
    resolver,
  });

  // Auto-fill customer code on a fresh form (skips when editing).
  const { data: previewedCode } = usePreviewCustomerCode(
    !initialCustomerData?.customerCode,
  );
  useEffect(() => {
    if (previewedCode && !defaults.customerCode) {
      setValue("customerCode", previewedCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewedCode]);

  // Derive PAN + place-of-supply state code from GSTIN automatically.
  const gstin = useWatch({ control, name: "gstin" });
  useEffect(() => {
    if (gstin && gstin.length === 15 && GSTIN_PATTERN.test(gstin)) {
      setValue("pan", gstin.slice(2, 12));
      setValue("placeOfSupplyStateCode", gstin.slice(0, 2));
    }
  }, [gstin, setValue]);

  const customerType = useWatch({ control, name: "type" });
  const isBusiness = customerType === CustomerType.BUSINESS;

  const altPhones = useFieldArray({
    control,
    name: "alternatePhones" as never,
  });
  const altEmails = useFieldArray({
    control,
    name: "alternateEmails" as never,
  });
  const contactPersons = useFieldArray({
    control,
    name: "contactPersons" as never,
  });

  const optionalSectionProps = compact
    ? { collapsible: true, defaultOpen: false }
    : {};
  // In the in-order modal the form is ~680px wide; 3-col grids truncate labels.
  const gridCols3 = compact
    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
    : "grid grid-cols-1 md:grid-cols-3 gap-4";
  const gridCols2 = compact
    ? "grid grid-cols-1 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ============ IDENTITY ============ */}
      <FormContainer title="Identity">
        <div className={gridCols3}>
          <TextFieldControlled
            label="Customer Code"
            name="customerCode"
            control={control}
            placeholder="CUST/0001"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextFieldControlled
            label="Display Name"
            name="name"
            control={control}
            required
          />
          <TextFieldControlled
            label="Legal Name"
            name="legalName"
            control={control}
            placeholder="As on GSTIN registry"
          />
          <SelectFieldControlled
            label="Type"
            name="type"
            control={control}
            options={Object.values(CustomerType)}
          />
          <SelectFieldControlled
            label="Status"
            name="status"
            control={control}
            options={Object.values(CustomerStatus)}
          />
          <SelectFieldControlled
            label="Source"
            name="source"
            control={control}
            options={sourceOptions}
          />
        </div>
      </FormContainer>

      {/* ============ CONTACT ============ */}
      <FormContainer title="Contact">
        <div className={gridCols2}>
          <PhoneFieldControlled
            name="phone"
            control={control}
            label="Phone"
            defaultCountry="IN"
            placeholder="Enter phone number"
            className="w-full"
            required
          />
          <TextFieldControlled
            label="Email"
            name="email"
            control={control}
            type="email"
            className="w-full"
          />
          {isBusiness && (
            <>
              <TextFieldControlled
                label="Contact Person"
                name="contactPersonName"
                control={control}
              />
              <TextFieldControlled
                label="Designation"
                name="contactPersonDesignation"
                control={control}
                placeholder="e.g. Purchase Manager"
              />
            </>
          )}
        </div>

        {/* Alternate phones */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Alternate Phone Numbers
            </span>
            <Button
              size="small"
              startIcon={<IoAdd />}
              onClick={() => altPhones.append("" as never)}
              type="button"
            >
              Add phone
            </Button>
          </div>
          {altPhones.fields.length === 0 ? (
            <p className="text-xs text-gray-400">
              No alternate phone numbers added.
            </p>
          ) : (
            <div className="space-y-2">
              {altPhones.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <PhoneFieldControlled
                      name={`alternatePhones.${index}`}
                      control={control}
                      label={`Phone ${index + 2}`}
                      defaultCountry="IN"
                    />
                  </div>
                  <IconButton
                    aria-label="Remove phone"
                    onClick={() => altPhones.remove(index)}
                    type="button"
                  >
                    <IoTrash className="text-red-600 text-lg" />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alternate emails */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Alternate Emails
            </span>
            <Button
              size="small"
              startIcon={<IoAdd />}
              onClick={() => altEmails.append("" as never)}
              type="button"
            >
              Add email
            </Button>
          </div>
          {altEmails.fields.length === 0 ? (
            <p className="text-xs text-gray-400">No alternate emails added.</p>
          ) : (
            <div className="space-y-2">
              {altEmails.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <TextFieldControlled
                      label={`Email ${index + 2}`}
                      name={`alternateEmails.${index}`}
                      control={control}
                      type="email"
                    />
                  </div>
                  <IconButton
                    aria-label="Remove email"
                    onClick={() => altEmails.remove(index)}
                    type="button"
                  >
                    <IoTrash className="text-red-600 text-lg" />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional contact persons (BUSINESS only) */}
        {isBusiness && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Additional Contact Persons
              </span>
              <Button
                size="small"
                startIcon={<IoAdd />}
                onClick={() =>
                  contactPersons.append({
                    name: "",
                    designation: "",
                    phone: "",
                    email: "",
                  } as never)
                }
                type="button"
              >
                Add contact person
              </Button>
            </div>
            {contactPersons.fields.length === 0 ? (
              <p className="text-xs text-gray-400">
                Only the primary contact above is captured.
              </p>
            ) : (
              <div className="space-y-3">
                {contactPersons.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        Contact #{index + 2}
                      </span>
                      <IconButton
                        aria-label="Remove contact person"
                        onClick={() => contactPersons.remove(index)}
                        type="button"
                        size="small"
                      >
                        <IoTrash className="text-red-600 text-base" />
                      </IconButton>
                    </div>
                    <div
                      className={
                        compact
                          ? "grid grid-cols-1 gap-3"
                          : "grid grid-cols-1 md:grid-cols-2 gap-3"
                      }
                    >
                      <TextFieldControlled
                        label="Name"
                        name={`contactPersons.${index}.name`}
                        control={control}
                      />
                      <TextFieldControlled
                        label="Designation"
                        name={`contactPersons.${index}.designation`}
                        control={control}
                        placeholder="e.g. Finance Head"
                      />
                      <PhoneFieldControlled
                        label="Phone"
                        name={`contactPersons.${index}.phone`}
                        control={control}
                        defaultCountry="IN"
                      />
                      <TextFieldControlled
                        label="Email"
                        name={`contactPersons.${index}.email`}
                        control={control}
                        type="email"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </FormContainer>

      {/* ============ GST & TAX ============ */}
      <FormContainer title="GST & Tax" {...optionalSectionProps}>
        <div className={gridCols3}>
          <SelectFieldControlled
            label="Registration Type"
            name="gstRegistrationType"
            control={control}
            options={gstTypeOptions}
          />
          <TextFieldControlled
            label="GSTIN"
            name="gstin"
            control={control}
            placeholder="27AAACX1234B1Z1"
          />
          <TextFieldControlled
            label="PAN"
            name="pan"
            control={control}
            placeholder="Auto-filled from GSTIN"
          />
          <TextFieldControlled
            label="Place of Supply (state code)"
            name="placeOfSupplyStateCode"
            control={control}
            placeholder="27"
          />
        </div>
      </FormContainer>

      {/* ============ BILLING ADDRESS ============ */}
      <FormContainer title="Billing Address" {...optionalSectionProps}>
        <AddressFields
          control={control}
          prefix="billingAddress"
          compact={compact}
        />
      </FormContainer>

      {/* ============ SHIPPING ADDRESS ============ */}
      <FormContainer
        title="Shipping Address (optional)"
        {...optionalSectionProps}
      >
        <p className="text-xs text-gray-500 mb-2">
          Leave empty to use the billing address as default shipping.
        </p>
        <AddressFields
          control={control}
          prefix="shippingAddress"
          compact={compact}
        />
      </FormContainer>

      {/* ============ BUSINESS TERMS ============ */}
      <FormContainer title="Business Terms" {...optionalSectionProps}>
        <div className={gridCols3}>
          <TextFieldControlled
            label="Credit Limit (₹)"
            name="creditLimit"
            control={control}
            type="number"
          />
          <TextFieldControlled
            label="Credit Period (days)"
            name="creditPeriodDays"
            control={control}
            type="number"
          />
          <SelectFieldControlled
            label="Payment Terms"
            name="paymentTerms"
            control={control}
            options={paymentTermsOptions}
          />
          <TextFieldControlled
            label="Opening Balance (₹)"
            name="openingBalance"
            control={control}
            type="number"
          />
          <TextFieldControlled
            label="Default Discount %"
            name="discountPercentDefault"
            control={control}
            type="number"
          />
          <TextFieldControlled
            label="Currency"
            name="currency"
            control={control}
          />
        </div>
      </FormContainer>

      {/* ============ CRM ============ */}
      <FormContainer title="Notes & Dates" {...optionalSectionProps}>
        <div className={gridCols2}>
          <DateFieldControlled
            label="Birthday"
            name="birthday"
            control={control}
          />
          <DateFieldControlled
            label="Anniversary"
            name="anniversary"
            control={control}
          />
        </div>
        <TextFieldControlled
          label="Notes"
          name="notes"
          control={control}
          multiline
          rows={3}
          className="mt-4"
        />
      </FormContainer>

      <div
        className={
          compact
            ? "sticky bottom-0 z-10 -mx-1 px-1 py-3 flex justify-end gap-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            : "flex justify-end gap-3 pb-6"
        }
      >
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
};

const AddressFields: React.FC<{
  control: any;
  prefix: string;
  compact?: boolean;
}> = ({ control, prefix, compact }) => (
  <div className="space-y-4">
    <TextFieldControlled
      label="Address Line 1"
      name={`${prefix}.address`}
      control={control}
    />
    <TextFieldControlled
      label="Address Line 2"
      name={`${prefix}.addressLine2`}
      control={control}
    />
    <div
      className={
        compact
          ? "grid grid-cols-1 md:grid-cols-2 gap-4"
          : "grid grid-cols-1 md:grid-cols-3 gap-4"
      }
    >
      <TextFieldControlled
        label="City"
        name={`${prefix}.city`}
        control={control}
      />
      <TextFieldControlled
        label="State"
        name={`${prefix}.state`}
        control={control}
      />
      <TextFieldControlled
        label="State code (2-digit)"
        name={`${prefix}.stateCode`}
        control={control}
        placeholder="27"
      />
      <CountrySelectControlled
        label="Country"
        name={`${prefix}.country`}
        control={control}
      />
      <TextFieldControlled
        label="Pin Code"
        name={`${prefix}.pinCode`}
        control={control}
      />
    </div>
  </div>
);
