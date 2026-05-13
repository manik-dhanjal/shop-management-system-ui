export enum PaymentTerms {
  IMMEDIATE = "IMMEDIATE",
  NET_7 = "NET_7",
  NET_15 = "NET_15",
  NET_30 = "NET_30",
  NET_45 = "NET_45",
  NET_60 = "NET_60",
  CUSTOM = "CUSTOM",
}

export const PaymentTermsLabel: Record<PaymentTerms, string> = {
  [PaymentTerms.IMMEDIATE]: "Immediate",
  [PaymentTerms.NET_7]: "Net 7 days",
  [PaymentTerms.NET_15]: "Net 15 days",
  [PaymentTerms.NET_30]: "Net 30 days",
  [PaymentTerms.NET_45]: "Net 45 days",
  [PaymentTerms.NET_60]: "Net 60 days",
  [PaymentTerms.CUSTOM]: "Custom",
};
