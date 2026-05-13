export enum CustomerSource {
  WALK_IN = "WALK_IN",
  REFERRAL = "REFERRAL",
  ONLINE = "ONLINE",
  CAMPAIGN = "CAMPAIGN",
  EXISTING = "EXISTING",
}

export const CustomerSourceLabel: Record<CustomerSource, string> = {
  [CustomerSource.WALK_IN]: "Walk-in",
  [CustomerSource.REFERRAL]: "Referral",
  [CustomerSource.ONLINE]: "Online",
  [CustomerSource.CAMPAIGN]: "Campaign",
  [CustomerSource.EXISTING]: "Existing (Migrated)",
};
