import { useEffect, useMemo } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { Button, IconButton } from "@mui/material";
import { IoAdd, IoTrash } from "react-icons/io5";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import SelectFieldControlled from "@shared/components/form/select-field-controlled.component";
import { PhoneFieldControlled } from "@shared/components/form/phone-field-controlled.component";
import { CountrySelectControlled } from "@shared/components/form/country-select-controlled.component";
import { FormContainer } from "@shared/components/form-container.component";
import { SupplierFormTypes } from "@features/supplier/interface/supplier.interface";
import { SupplierStatus } from "@shared/enums/supplier-status.enum";
import {
  PaymentTerms,
  PaymentTermsLabel,
} from "@shared/enums/payment-terms.enum";
import { usePreviewSupplierCode } from "../hooks/use-preview-supplier-code.hook";

interface SupplierFormProps {
  onSubmit: SubmitHandler<SupplierFormTypes>;
  isLoading?: boolean;
  initialData?: Partial<SupplierFormTypes>;
  submitLabel?: string;
  /** Hide the supplier-shop identity sections (used for in-system linked shops). */
  linkMetadataOnly?: boolean;
  compact?: boolean;
}

export const INITIAL_SUPPLIER_FORM: SupplierFormTypes = {
  supplierCode: undefined,
  alias: "",
  status: SupplierStatus.ACTIVE,
  paymentTerms: PaymentTerms.IMMEDIATE,
  creditLimit: 0,
  creditPeriodDays: 0,
  openingBalance: 0,
  defaultDiscountPct: 0,
  tags: [],
  notes: "",
  primaryContact: { name: "", phone: "", email: "" },
  newShop: {
    name: "",
    location: undefined,
    gstDetails: undefined,
    phone: "",
    email: "",
    alternatePhones: [],
    alternateEmails: [],
    contactPersonName: "",
    contactPersonDesignation: "",
    contactPersons: [],
  },
};

const GSTIN_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

const schema = yup.object({
  alias: yup.string().optional(),
});

const paymentTermsOptions = Object.values(PaymentTerms).map((v) => ({
  label: PaymentTermsLabel[v],
  value: v,
}));

export const SupplierForm: React.FC<SupplierFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
  submitLabel = "Save Supplier",
  linkMetadataOnly = false,
  compact = false,
}) => {
  const resolver = useYupValidationResolver(schema);

  const defaults = useMemo<SupplierFormTypes>(
    () =>
      initialData
        ? ({ ...INITIAL_SUPPLIER_FORM, ...initialData } as SupplierFormTypes)
        : INITIAL_SUPPLIER_FORM,
    [initialData],
  );

  const { control, handleSubmit, setValue } = useForm<SupplierFormTypes>({
    defaultValues: defaults,
    resolver,
  });

  // Auto-preview SUP/NNNN code on a fresh form (skipped when editing).
  const { data: previewCode } = usePreviewSupplierCode(
    !initialData?.supplierCode,
  );
  useEffect(() => {
    if (previewCode && !defaults.supplierCode) {
      setValue("supplierCode", previewCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewCode]);

  const altPhones = useFieldArray({
    control,
    name: "newShop.alternatePhones" as never,
  });
  const altEmails = useFieldArray({
    control,
    name: "newShop.alternateEmails" as never,
  });
  const contactPersons = useFieldArray({
    control,
    name: "newShop.contactPersons" as never,
  });

  const optionalSectionProps = compact
    ? { collapsible: true, defaultOpen: false }
    : {};
  const gridCols3 = compact
    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
    : "grid grid-cols-1 md:grid-cols-3 gap-4";
  const gridCols2 = compact
    ? "grid grid-cols-1 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ============ IDENTITY (link metadata) ============ */}
      <FormContainer title="Identity">
        <div className={gridCols3}>
          <TextFieldControlled
            label="Supplier Code"
            name="supplierCode"
            control={control}
            placeholder="SUP/0001"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          {!linkMetadataOnly && (
            <TextFieldControlled
              label="Supplier Name"
              name="newShop.name"
              control={control}
              required
            />
          )}
          <TextFieldControlled label="Alias" name="alias" control={control} />
          <SelectFieldControlled
            label="Status"
            name="status"
            control={control}
            options={Object.values(SupplierStatus)}
          />
        </div>
      </FormContainer>

      {!linkMetadataOnly && (
        <>
          {/* ============ CONTACT (on the supplier Shop) ============ */}
          <FormContainer title="Contact">
            <div className={gridCols2}>
              <PhoneFieldControlled
                name="newShop.phone"
                control={control}
                label="Phone"
                defaultCountry="IN"
                className="w-full"
              />
              <TextFieldControlled
                label="Email"
                name="newShop.email"
                control={control}
                type="email"
              />
              <TextFieldControlled
                label="Contact Person"
                name="newShop.contactPersonName"
                control={control}
              />
              <TextFieldControlled
                label="Designation"
                name="newShop.contactPersonDesignation"
                control={control}
                placeholder="e.g. Sales Manager"
              />
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
                          name={`newShop.alternatePhones.${index}`}
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
                <p className="text-xs text-gray-400">
                  No alternate emails added.
                </p>
              ) : (
                <div className="space-y-2">
                  {altEmails.fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <div className="flex-1">
                        <TextFieldControlled
                          label={`Email ${index + 2}`}
                          name={`newShop.alternateEmails.${index}`}
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

            {/* Additional contact persons */}
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
                          name={`newShop.contactPersons.${index}.name`}
                          control={control}
                        />
                        <TextFieldControlled
                          label="Designation"
                          name={`newShop.contactPersons.${index}.designation`}
                          control={control}
                          placeholder="e.g. Logistics Head"
                        />
                        <PhoneFieldControlled
                          label="Phone"
                          name={`newShop.contactPersons.${index}.phone`}
                          control={control}
                          defaultCountry="IN"
                          className="w-full"
                        />
                        <TextFieldControlled
                          label="Email"
                          name={`newShop.contactPersons.${index}.email`}
                          control={control}
                          type="email"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormContainer>

          {/* ============ GST (on the supplier Shop) ============ */}
          <FormContainer title="GST & Tax" {...optionalSectionProps}>
            <div className={gridCols3}>
              <TextFieldControlled
                label="GSTIN"
                name="newShop.gstDetails.gstin"
                control={control}
                placeholder="27AAACX1234B1Z1"
              />
              <TextFieldControlled
                label="Legal Name"
                name="newShop.gstDetails.legalName"
                control={control}
              />
              <TextFieldControlled
                label="State"
                name="newShop.gstDetails.state"
                control={control}
              />
              <TextFieldControlled
                label="PAN"
                name="newShop.gstDetails.panCardNumber"
                control={control}
                placeholder="Auto-derivable from GSTIN"
              />
            </div>
          </FormContainer>

          {/* ============ ADDRESS (on the supplier Shop) ============ */}
          <FormContainer title="Address" {...optionalSectionProps}>
            <div className="space-y-4">
              <TextFieldControlled
                label="Address Line 1"
                name="newShop.location.address"
                control={control}
              />
              <TextFieldControlled
                label="Address Line 2"
                name="newShop.location.addressLine2"
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
                  name="newShop.location.city"
                  control={control}
                />
                <TextFieldControlled
                  label="State"
                  name="newShop.location.state"
                  control={control}
                />
                <TextFieldControlled
                  label="State code"
                  name="newShop.location.stateCode"
                  control={control}
                  placeholder="27"
                />
                <CountrySelectControlled
                  label="Country"
                  name="newShop.location.country"
                  control={control}
                />
                <TextFieldControlled
                  label="Pin Code"
                  name="newShop.location.pinCode"
                  control={control}
                />
              </div>
            </div>
          </FormContainer>
        </>
      )}

      {/* ============ BUSINESS TERMS (link metadata) ============ */}
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
            label="Opening Balance (we owe ₹)"
            name="openingBalance"
            control={control}
            type="number"
          />
          <TextFieldControlled
            label="Default Discount %"
            name="defaultDiscountPct"
            control={control}
            type="number"
          />
        </div>
      </FormContainer>

      {/* ============ NOTES (link metadata) ============ */}
      <FormContainer title="Notes & Tags" {...optionalSectionProps}>
        <TextFieldControlled
          label="Notes"
          name="notes"
          control={control}
          multiline
          rows={3}
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
