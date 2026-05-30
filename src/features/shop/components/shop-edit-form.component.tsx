import { useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import * as yup from "yup";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import { Shop, ShopGstDetails } from "@features/shop/interface/shop.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";
import { ShopStatus } from "@shared/enums/shop-status.enum";
import { useStatesByCountry } from "@features/location/hooks/use-states-by-country.hook";
import { useRequestGstOtp } from "@features/shop/hooks/use-request-gst-otp.hook";
import { useVerifyGstOtp } from "@features/shop/hooks/use-verify-gst-otp.hook";
import { GstVerifyPanel } from "./gst-verify-panel.component";

export type ShopEditFormValues = Partial<Shop>;

type GstVerifyStep = "idle" | "otp_sent" | "verifying" | "done" | "error";

interface Props {
  initial: ShopEditFormValues;
  onSubmit: SubmitHandler<ShopEditFormValues>;
  isLoading?: boolean;
  submitLabel?: string;
  shopId?: string;
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
    legalName: yup.string().trim().optional(),
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
      .test(
        "pan-length",
        "PAN must be 10 characters",
        (v) => !v || v.length === 10,
      )
      .optional(),
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
  shopId,
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
  } = useForm<ShopEditFormValues>({
    defaultValues: defaults,
    resolver,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  // ── GST OTP verification state ───────────────────────────────────────────
  const [gstVerifyStep, setGstVerifyStep] = useState<GstVerifyStep>(
    () => (initial.gstDetails?.verifiedAt ? "done" : "idle"),
  );
  const [otpValue, setOtpValue] = useState("");
  const [otpEmail, setOtpEmail] = useState(initial.gstDetails?.email ?? "");
  const [gstVerifyError, setGstVerifyError] = useState<string | null>(null);
  // Holds the taxpayer data returned by the verify mutation so the panel can
  // show "Verified from GST Portal" immediately — before the shop refetch completes.
  const [verifiedGstDetails, setVerifiedGstDetails] = useState<ShopGstDetails | null>(
    initial.gstDetails?.verifiedAt ? initial.gstDetails : null,
  );

  const requestOtpMutation = useRequestGstOtp(shopId ?? "");
  const verifyOtpMutation = useVerifyGstOtp(shopId ?? "");

  const initialGstin = useRef(initial.gstDetails?.gstin ?? "");

  const handleSendOtp = async () => {
    setGstVerifyError(null);
    try {
      await requestOtpMutation.mutateAsync({ gstin: gstin ?? "" });
      setGstVerifyStep("otp_sent");
    } catch (err: any) {
      setGstVerifyError(
        err?.response?.data?.message ?? "Failed to send OTP. Try again.",
      );
    }
  };

  const handleVerifyOtp = async () => {
    setGstVerifyError(null);
    setGstVerifyStep("verifying");
    try {
      const result = await verifyOtpMutation.mutateAsync({
        gstin: gstin ?? "",
        otp: otpValue,
        email: otpEmail || undefined,
      });
      // Store the verified taxpayer data immediately so the panel shows "Verified from
      // GST Portal" before the shop refetch completes (the hook's onSuccess invalidates
      // the cache but the fetch is async — result is available right now).
      if (result) setVerifiedGstDetails(result as ShopGstDetails);
      setGstVerifyStep("done");
      setOtpValue("");
    } catch (err: any) {
      setGstVerifyError(
        err?.response?.data?.message ?? "Verification failed. Try again.",
      );
      setGstVerifyStep("error");
    }
  };

  const { data: indianStates } = useStatesByCountry("IN");

  // Auto-populate PAN and state from GSTIN when a valid 15-char GSTIN is entered.
  const gstin = useWatch({ control, name: "gstDetails.gstin" }) as string;

  // Reset verify step when user changes the GSTIN away from the verified value.
  useEffect(() => {
    if (gstVerifyStep === "done" && gstin !== initialGstin.current) {
      setGstVerifyStep("idle");
      setVerifiedGstDetails(null);
    }
  }, [gstin, gstVerifyStep]);

  // Sync verifiedGstDetails from a refetch if the shop was already verified in DB.
  useEffect(() => {
    if (initial.gstDetails?.verifiedAt && !verifiedGstDetails) {
      setVerifiedGstDetails(initial.gstDetails);
    }
  }, [initial.gstDetails?.verifiedAt]);

  useEffect(() => {
    if (gstin && gstin.length === 15 && GSTIN_PATTERN.test(gstin)) {
      if (gstVerifyStep !== "done") {
        setValue("gstDetails.panCardNumber", gstin.slice(2, 12));
        const stateCode = gstin.slice(0, 2);
        const stateEntry = indianStates?.find((s) => s.code === stateCode);
        if (stateEntry) setValue("gstDetails.state", stateEntry.name);
      }
    }
  }, [gstin, indianStates, setValue, gstVerifyStep]);

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
            <div className="flex flex-col gap-4">
              {/* GSTIN row */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextFieldControlled
                    label="GSTIN"
                    name="gstDetails.gstin"
                    control={control}
                    placeholder="27AAACX1234B1Z1"
                  />
                </div>
                {gstVerifyStep === "done" && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Verified"
                    color="success"
                    size="small"
                    sx={{ mb: 0.5 }}
                  />
                )}
              </div>

              {/* Send OTP button — shown when idle and GSTIN is valid */}
              {gstVerifyStep === "idle" && (
                <div className="flex items-center gap-2">
                  {shopId ? (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleSendOtp}
                      disabled={
                        !gstin ||
                        gstin.length !== 15 ||
                        !GSTIN_PATTERN.test(gstin) ||
                        requestOtpMutation.isPending
                      }
                      startIcon={
                        requestOtpMutation.isPending ? (
                          <CircularProgress size={12} />
                        ) : undefined
                      }
                    >
                      {requestOtpMutation.isPending
                        ? "Sending OTP…"
                        : "Send OTP to verify ↗"}
                    </Button>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Save the shop first, then verify your GSTIN from the Edit
                      page.
                    </Typography>
                  )}
                  {gstVerifyError && (
                    <Typography variant="caption" color="error">
                      {gstVerifyError}
                    </Typography>
                  )}
                </div>
              )}

              {/* OTP input — shown after OTP is sent */}
              {(gstVerifyStep === "otp_sent" ||
                gstVerifyStep === "verifying" ||
                gstVerifyStep === "error") && (
                <div className="flex flex-col gap-3">
                  <Alert severity="info" sx={{ py: 0.5 }}>
                    OTP sent to your GST-registered mobile / email. Enter the
                    6-digit OTP below.
                  </Alert>
                  <div className="flex items-center gap-2 flex-wrap">
                    <TextField
                      size="small"
                      label="OTP"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      inputProps={{ maxLength: 6 }}
                      sx={{ width: 140 }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleVerifyOtp}
                      disabled={
                        otpValue.length < 4 || gstVerifyStep === "verifying"
                      }
                      startIcon={
                        gstVerifyStep === "verifying" ? (
                          <CircularProgress size={12} />
                        ) : undefined
                      }
                    >
                      {gstVerifyStep === "verifying" ? "Verifying…" : "Verify"}
                    </Button>
                    <Button
                      size="small"
                      onClick={handleSendOtp}
                      disabled={requestOtpMutation.isPending}
                    >
                      Resend OTP
                    </Button>
                  </div>
                  <TextField
                    size="small"
                    label="GST-registered email (optional)"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    type="email"
                    fullWidth
                    helperText="Needed for taxpayer data lookup"
                  />
                  {gstVerifyError && (
                    <Alert severity="error" sx={{ py: 0.5 }}>
                      {gstVerifyError}
                    </Alert>
                  )}
                </div>
              )}

              {/* Re-verify button and locked panel — shown when verified */}
              {gstVerifyStep === "done" && (
                <>
                  <div className="flex items-center justify-between">
                    <Typography variant="caption" color="text.secondary">
                      ✓ Last verified:{" "}
                      {initial.gstDetails?.verifiedAt
                        ? new Date(
                            initial.gstDetails.verifiedAt,
                          ).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "just now"}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setGstVerifyStep("idle");
                        setOtpValue("");
                        setGstVerifyError(null);
                        setVerifiedGstDetails(null);
                      }}
                    >
                      Re-verify
                    </Button>
                  </div>
                  <GstVerifyPanel
                    gstDetails={
                      verifiedGstDetails ??
                      initial.gstDetails ??
                      { gstin: gstin ?? "" }
                    }
                  />
                </>
              )}

              {/* Manual fields — shown when not verified */}
              {gstVerifyStep !== "done" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextFieldControlled
                    label="Legal Name"
                    name="gstDetails.legalName"
                    control={control}
                  />
                  <TextFieldControlled
                    label="PAN"
                    name="gstDetails.panCardNumber"
                    control={control}
                    placeholder="Auto-filled from GSTIN"
                  />
                  <TextFieldControlled
                    label="State"
                    name="gstDetails.state"
                    control={control}
                    placeholder="Auto-filled from GSTIN"
                  />
                </div>
              )}

              {/* Portal credentials — shown when verified */}
              {gstVerifyStep === "done" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextFieldControlled
                    label="GST Portal Username (optional)"
                    name="gstDetails.username"
                    control={control}
                  />
                  <TextFieldControlled
                    label="GST Portal Email (optional)"
                    name="gstDetails.email"
                    control={control}
                    type="email"
                  />
                </div>
              )}
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
