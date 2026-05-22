import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import * as yup from "yup";
import { Button, Chip, Collapse, IconButton, TextField } from "@mui/material";
import {
  IoAdd,
  IoChevronDown,
  IoChevronForward,
  IoTrash,
} from "react-icons/io5";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import SelectFieldControlled from "@shared/components/form/select-field-controlled.component";
import { PhoneFieldControlled } from "@shared/components/form/phone-field-controlled.component";
import { LocationFormSection } from "@shared/components/form/location-form-section.component";
import { FormContainer } from "@shared/components/form-container.component";
import { Shop } from "@features/shop/interface/shop.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";
import { ShopStatus } from "@shared/enums/shop-status.enum";
import { useStatesByCountry } from "@features/location/hooks/use-states-by-country.hook";

export type ShopEditFormValues = Partial<Shop>;

interface Props {
  initial: ShopEditFormValues;
  onSubmit: SubmitHandler<ShopEditFormValues>;
  isLoading?: boolean;
  submitLabel?: string;
}

const GSTIN_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

const locationSchema = yup
  .object({
    address: yup.string().trim().required("Address is required"),
    addressLine2: yup.string().trim().optional(),
    country: yup.string().trim().required("Country is required"),
    state: yup.string().trim().required("State is required"),
    stateCode: yup
      .string()
      .trim()
      .transform((v) => v || undefined)
      .matches(/^[0-9]{2}$/, "State code must be 2 digits")
      .optional(),
    city: yup.string().trim().required("City is required"),
    pinCode: yup.string().trim().required("Pin Code is required"),
    countryRef: yup.string().trim().nullable().optional(),
    stateRef: yup.string().trim().nullable().optional(),
  })
  .transform((value, originalValue) => {
    if (!originalValue) return undefined;
    const hasAnyValue = Object.values(originalValue).some(
      (item) => item !== undefined && item !== null && item !== "",
    );
    return hasAnyValue ? value : undefined;
  })
  .optional();

const gstDetailsSchema = yup
  .object({
    gstin: yup
      .string()
      .trim()
      .length(15, "GSTIN must be exactly 15 characters")
      .matches(GSTIN_PATTERN, "Invalid GSTIN format")
      .required("GSTIN is required"),
    legalName: yup.string().trim().required("Legal name is required"),
    tradeName: yup.string().trim().optional(),
    address: yup.string().trim().optional(),
    state: yup.string().trim().optional(),
    registrationDate: yup
      .string()
      .trim()
      .test("valid-iso-date", "Must be a valid ISO 8601 date", (v) =>
        v ? !isNaN(Date.parse(v)) : true,
      )
      .optional(),
    status: yup
      .string()
      .oneOf(
        ["Active", "Inactive", "Suspended", "Cancelled"],
        "Status must be one of: Active, Inactive, Suspended, Cancelled",
      )
      .optional(),
    username: yup.string().trim().optional(),
    email: yup.string().trim().email("Invalid email").optional(),
    panCardNumber: yup
      .string()
      .trim()
      .length(10, "PAN must be 10 characters")
      .required("PAN is required"),
  })
  .transform((value, originalValue) => {
    if (!originalValue) return undefined;
    const hasAnyValue = Object.values(originalValue).some(
      (item) => item !== undefined && item !== null && item !== "",
    );
    return hasAnyValue ? value : undefined;
  })
  .optional();

const schema = yup.object({
  name: yup.string().trim().required("Shop name is required"),
  description: yup.string().trim().optional(),
  kind: yup
    .string()
    .oneOf(Object.values(ShopKind) as string[])
    .optional(),
  status: yup
    .string()
    .oneOf(Object.values(ShopStatus) as string[])
    .optional(),
  currency: yup.string().trim().optional(),
  timezone: yup.string().trim().optional(),
  logo: yup.string().trim().optional(),
  email: yup.string().trim().email("Invalid email").optional(),
  billingEmail: yup.string().trim().email("Invalid billing email").optional(),
  phone: yup.string().trim().required(),
  alternatePhones: yup.array().of(yup.string().trim()).optional(),
  alternateEmails: yup
    .array()
    .of(yup.string().trim().email("Invalid email in alternate emails"))
    .optional(),
  contactPersonName: yup.string().trim().required(),
  contactPersonDesignation: yup.string().trim().required(),
  contactPersons: yup
    .array()
    .of(
      yup.object({
        name: yup.string().trim().required("Contact person name is required"),
        designation: yup.string().trim().optional(),
        phone: yup.string().trim().optional(),
        email: yup.string().trim().email("Invalid email").optional(),
      }),
    )
    .optional(),
  location: locationSchema,
  gstDetails: gstDetailsSchema,
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
  const resolver = useYupValidationResolver(schema);

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

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ShopEditFormValues>({
    defaultValues: defaults,
    resolver,
  });
  console.log("Form errors:", errors);
  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const { data: indianStates } = useStatesByCountry("IN");

  // Auto-populate PAN and state from GSTIN when a valid 15-char GSTIN is entered.
  const gstin = useWatch({ control, name: "gstDetails.gstin" }) as string;
  useEffect(() => {
    if (gstin && gstin.length === 15 && GSTIN_PATTERN.test(gstin)) {
      setValue("gstDetails.panCardNumber", gstin.slice(2, 12));
      const stateCode = gstin.slice(0, 2);
      const stateEntry = indianStates?.find((s) => s.code === stateCode);
      if (stateEntry) setValue("gstDetails.state", stateEntry.name);
    }
  }, [gstin, indianStates, setValue]);

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

  const phoneValues =
    (useWatch({ control, name: "alternatePhones" }) as string[]) || [];
  const emailValues =
    (useWatch({ control, name: "alternateEmails" }) as string[]) || [];

  const [newPhone, setNewPhone] = useState("");
  const [addingPhone, setAddingPhone] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [addingEmail, setAddingEmail] = useState(false);
  const [expandedContact, setExpandedContact] = useState<number | null>(null);

  const handleAddPhone = () => {
    const trimmed = newPhone.trim();
    if (trimmed) {
      altPhones.append(trimmed as never);
      setNewPhone("");
      setAddingPhone(false);
    }
  };

  const handleAddEmail = () => {
    const trimmed = newEmail.trim();
    if (trimmed) {
      altEmails.append(trimmed as never);
      setNewEmail("");
      setAddingEmail(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* items-start prevents shorter cards from stretching to match their taller neighbour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-start">
        <div className="flex flex-col gap-4">
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
          <FormContainer title="GST & Tax">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFieldControlled
                label="GSTIN"
                name="gstDetails.gstin"
                control={control}
                placeholder="27AAACX1234B1Z1"
                required
              />
              <TextFieldControlled
                label="Legal Name"
                name="gstDetails.legalName"
                control={control}
                required
              />
              <TextFieldControlled
                label="PAN"
                name="gstDetails.panCardNumber"
                control={control}
                placeholder="Auto-filled from GSTIN"
                required
              />
              <TextFieldControlled
                label="State"
                name="gstDetails.state"
                control={control}
                placeholder="Auto-filled from GSTIN"
                required
              />
            </div>
          </FormContainer>
          <FormContainer title="Address">
            <LocationFormSection
              control={control}
              setValue={setValue}
              namePrefix="location"
            />
          </FormContainer>
        </div>

        <FormContainer title="Contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhoneFieldControlled
              name="phone"
              control={control}
              label="Phone"
              defaultCountry="IN"
              className="w-full"
              required
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
              required
            />
            <TextFieldControlled
              label="Designation"
              name="contactPersonDesignation"
              control={control}
              required
            />
          </div>

          {/* Alternate phones — chips inline with Add button */}
          <div className="mt-5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              Alternate Phones
            </span>
            <div className="flex flex-wrap gap-1.5 items-center">
              {phoneValues.map((phone, index) => (
                <Chip
                  key={index}
                  label={phone}
                  size="small"
                  onDelete={() => altPhones.remove(index)}
                />
              ))}
              <Button
                size="small"
                startIcon={<IoAdd />}
                onClick={() => setAddingPhone(true)}
                type="button"
              >
                Add phone
              </Button>
            </div>
            {addingPhone && (
              <div className="flex gap-2 mt-2">
                <TextField
                  size="small"
                  placeholder="+91 9876543210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPhone();
                    }
                  }}
                  autoFocus
                  className="flex-1"
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddPhone}
                  type="button"
                  disabled={!newPhone.trim()}
                >
                  Add
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setAddingPhone(false);
                    setNewPhone("");
                  }}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Alternate emails — chips inline with Add button */}
          <div className="mt-5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              Alternate Emails
            </span>
            <div className="flex flex-wrap gap-1.5 items-center">
              {emailValues.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  size="small"
                  onDelete={() => altEmails.remove(index)}
                />
              ))}
              <Button
                size="small"
                startIcon={<IoAdd />}
                onClick={() => setAddingEmail(true)}
                type="button"
              >
                Add email
              </Button>
            </div>
            {addingEmail && (
              <div className="flex gap-2 mt-2">
                <TextField
                  size="small"
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                  type="email"
                  autoFocus
                  className="flex-1"
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddEmail}
                  type="button"
                  disabled={!newEmail.trim()}
                >
                  Add
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setAddingEmail(false);
                    setNewEmail("");
                  }}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Additional contact persons — accordion rows */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Additional Contact Persons
              </span>
              <Button
                size="small"
                startIcon={<IoAdd />}
                onClick={() => {
                  const nextIndex = contactPersons.fields.length;
                  contactPersons.append({
                    name: "",
                    designation: "",
                    phone: "",
                    email: "",
                  } as never);
                  setExpandedContact(nextIndex);
                }}
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
              <div className="space-y-1">
                {contactPersons.fields.map((field, index) => {
                  const isOpen = expandedContact === index;
                  return (
                    <div
                      key={field.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() =>
                          setExpandedContact(isOpen ? null : index)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setExpandedContact(isOpen ? null : index);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isOpen ? (
                            <IoChevronDown className="text-gray-400 text-sm flex-shrink-0" />
                          ) : (
                            <IoChevronForward className="text-gray-400 text-sm flex-shrink-0" />
                          )}
                          <ContactPersonSummary
                            control={control}
                            index={index}
                          />
                        </div>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            contactPersons.remove(index);
                            if (expandedContact === index)
                              setExpandedContact(null);
                            else if (
                              expandedContact !== null &&
                              expandedContact > index
                            )
                              setExpandedContact(expandedContact - 1);
                          }}
                          type="button"
                          aria-label="Remove contact person"
                        >
                          <IoTrash className="text-red-500 text-sm" />
                        </IconButton>
                      </div>
                      <Collapse in={isOpen}>
                        <div className="px-3 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700">
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
                              className="w-full"
                            />
                            <TextFieldControlled
                              label="Email"
                              name={`contactPersons.${index}.email`}
                              control={control}
                              type="email"
                            />
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </FormContainer>
      </div>

      <FormContainer title="Preferences" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectFieldControlled
            label="Currency"
            name="currency"
            control={control}
            options={CURRENCIES}
            required
          />
          <SelectFieldControlled
            label="Timezone"
            name="timezone"
            control={control}
            options={TIMEZONES}
            required
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

const ContactPersonSummary: React.FC<{ control: any; index: number }> = ({
  control,
  index,
}) => {
  const name =
    (useWatch({ control, name: `contactPersons.${index}.name` }) as string) ||
    "";
  const designation =
    (useWatch({
      control,
      name: `contactPersons.${index}.designation`,
    }) as string) || "";

  return (
    <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
      {name || <span className="text-gray-400 italic">New contact</span>}
      {designation && (
        <span className="text-gray-400 ml-1">· {designation}</span>
      )}
    </span>
  );
};
