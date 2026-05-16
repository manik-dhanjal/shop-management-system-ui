export enum ShopKind {
  SELF_OPERATED = "SELF_OPERATED",
  EXTERNAL_SUPPLIER = "EXTERNAL_SUPPLIER",
}

export const ShopKindLabel: Record<ShopKind, string> = {
  [ShopKind.SELF_OPERATED]: "In-system shop",
  [ShopKind.EXTERNAL_SUPPLIER]: "External supplier",
};
