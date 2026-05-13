export enum GstRegistrationType {
  REGULAR = "REGULAR",
  COMPOSITION = "COMPOSITION",
  UNREGISTERED = "UNREGISTERED",
  CONSUMER = "CONSUMER",
  SEZ_WITH_PAYMENT = "SEZ_WITH_PAYMENT",
  SEZ_WITHOUT_PAYMENT = "SEZ_WITHOUT_PAYMENT",
  OVERSEAS_EXPORT = "OVERSEAS_EXPORT",
}

/** Labels shown in dropdowns / chips. */
export const GstRegistrationTypeLabel: Record<GstRegistrationType, string> = {
  [GstRegistrationType.REGULAR]: "Regular",
  [GstRegistrationType.COMPOSITION]: "Composition",
  [GstRegistrationType.UNREGISTERED]: "Unregistered",
  [GstRegistrationType.CONSUMER]: "Consumer (B2C)",
  [GstRegistrationType.SEZ_WITH_PAYMENT]: "SEZ — with payment",
  [GstRegistrationType.SEZ_WITHOUT_PAYMENT]: "SEZ — without payment",
  [GstRegistrationType.OVERSEAS_EXPORT]: "Overseas / Export",
};
