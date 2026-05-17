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
import { Shop } from "@features/shop/interface/shop.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";
import { ShopStatus } from "@shared/enums/shop-status.enum";

export type ShopEditFormValues = Partial<Shop>;

interface Props {
  initial: ShopEditFormValues;
  onSubmit: SubmitHandler<ShopEditFormValues>;
  isLoading?: boolean;
  submitLabel?: string;
}

const schema = yup.object({
  name: yup.string().required("Shop name is required"),
  email: yup.string().email("Invalid email").optional(),
  billingEmail: yup.string().email("Invalid billing email").optional(),
});

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];
const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
];

export const ShopEditForm: React.FC<Props> = ({
  initial,
  onSubmit,
  isLoading,
  submitLabel = "Save Changes",
}) => {
  const resolver = useYupValidationResolver(schema as any);

  const defaults = useMemo<ShopEditFormValues>(
    () => ({
      name: "",
      description: "",
      kind: ShopKind.SELF_OPERATED,
      status: ShopStatus.ACTIVE,
      currency: "INR",
      timezone: "Asia/Kolkata",
      billingEmail: "",
      phone: "",
      email: "",
      alternatePhones: [],
      alternateEmails: [],
      contactPersonName: "",
      contactPersonDesignation: "",
      contactPersons: [],
      location: undefined,
      gstDetails: undefined,
      ...initial,
    }),
    [initial],
  );

  const { control, handleSubmit, reset } = useForm<ShopEditFormValues>({
    defaultValues: defaults,
    resolver,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormContainer title="Identity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldControlled
            label="Shop Name"
            name="name"
            control={control}
            required
          />
          <SelectFieldControlled
            label="Status"
            name="status"
            control={control}
            options={Object.values(ShopStatus)}
          />
          <TextFieldControlled
            label="Description"
            name="description"
            control={control}
            multiline
            rows={2}
            className="md:col-span-2"
          />
        </div>
      </FormContainer>

      <FormContainer title="Contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PhoneFieldControlled
            name="phone"
            control={control}
            label="Phone"
            defaultCountry="IN"
          />
          <TextFieldControlled
            label="Email"
            name="email"
            control={control}
            type="email"
          />
          <TextFieldControlled
            label="Contact Person"
            name="contactPersonName"
            control={control}
          />
          <TextFieldControlled
            label="Designation"
            name="contactPersonDesignation"
            control={control}
          />
        </div>

        <Repeater
          label="Alternate Phone Numbers"
          empty="No alternate phone numbers added."
          addLabel="Add phone"
          fields={altPhones.fields}
          onAdd={() => altPhones.append("" as never)}
          onRemove={altPhones.remove}
          renderRow={(_, index) => (
            <div className="flex-1">
              <PhoneFieldControlled
                name={`alternatePhones.${index}`}
                control={control}
                label={`Phone ${index + 2}`}
                defaultCountry="IN"
              />
            </div>
          )}
        />

        <Repeater
          label="Alternate Emails"
          empty="No alternate emails added."
          addLabel="Add email"
          fields={altEmails.fields}
          onAdd={() => altEmails.append("" as never)}
          onRemove={altEmails.remove}
          renderRow={(_, index) => (
            <div className="flex-1">
              <TextFieldControlled
                label={`Email ${index + 2}`}
                name={`alternateEmails.${index}`}
                control={control}
                type="email"
              />
            </div>
          )}
        />

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <TextFieldControlled
                      label="Name"
                      name={`contactPersons.${index}.name`}
                      control={control}
                    />
                    <TextFieldControlled
                      label="Designation"
                      name={`contactPersons.${index}.designation`}
                      control={control}
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
      </FormContainer>

      <FormContainer title="GST & Tax">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldControlled
            label="GSTIN"
            name="gstDetails.gstin"
            control={control}
            placeholder="27AAACX1234B1Z1"
          />
          <TextFieldControlled
            label="Legal Name"
            name="gstDetails.legalName"
            control={control}
          />
          <TextFieldControlled
            label="PAN"
            name="gstDetails.panCardNumber"
            control={control}
          />
          <TextFieldControlled
            label="State"
            name="gstDetails.state"
            control={control}
          />
        </div>
      </FormContainer>

      <FormContainer title="Address">
        <div className="space-y-4">
          <TextFieldControlled
            label="Address Line 1"
            name="location.address"
            control={control}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextFieldControlled
              label="City"
              name="location.city"
              control={control}
            />
            <TextFieldControlled
              label="State"
              name="location.state"
              control={control}
            />
            <TextFieldControlled
              label="State code"
              name="location.stateCode"
              control={control}
              placeholder="27"
            />
            <CountrySelectControlled
              label="Country"
              name="location.country"
              control={control}
            />
            <TextFieldControlled
              label="Pin Code"
              name="location.pinCode"
              control={control}
            />
          </div>
        </div>
      </FormContainer>

      <FormContainer title="Preferences">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectFieldControlled
            label="Currency"
            name="currency"
            control={control}
            options={CURRENCIES}
          />
          <SelectFieldControlled
            label="Timezone"
            name="timezone"
            control={control}
            options={TIMEZONES}
          />
          <TextFieldControlled
            label="Billing Email"
            name="billingEmail"
            control={control}
            type="email"
          />
        </div>
      </FormContainer>

      <div className="flex justify-end gap-3 pb-6">
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
};

const Repeater: React.FC<{
  label: string;
  empty: string;
  addLabel: string;
  fields: Array<{ id: string }>;
  onAdd: () => void;
  onRemove: (i: number) => void;
  renderRow: (field: { id: string }, index: number) => React.ReactNode;
}> = ({ label, empty, addLabel, fields, onAdd, onRemove, renderRow }) => (
  <div className="mt-5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {label}
      </span>
      <Button size="small" startIcon={<IoAdd />} onClick={onAdd} type="button">
        {addLabel}
      </Button>
    </div>
    {fields.length === 0 ? (
      <p className="text-xs text-gray-400">{empty}</p>
    ) : (
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            {renderRow(field, index)}
            <IconButton
              aria-label="Remove"
              onClick={() => onRemove(index)}
              type="button"
            >
              <IoTrash className="text-red-600 text-lg" />
            </IconButton>
          </div>
        ))}
      </div>
    )}
  </div>
);
