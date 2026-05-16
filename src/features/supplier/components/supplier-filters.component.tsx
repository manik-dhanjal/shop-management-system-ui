import { MenuItem, TextField } from "@mui/material";
import { ShopLookupQuery } from "@features/supplier/interface/supplier.interface";
import { ShopKind, ShopKindLabel } from "@shared/enums/shop-kind.enum";

interface Props {
  value: ShopLookupQuery;
  onChange: (next: ShopLookupQuery) => void;
}

const INDIAN_STATES = [
  "Delhi",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Gujarat",
  "Maharashtra",
  "Karnataka",
  "Kerala",
  "Tamil Nadu",
  "Telangana",
];

const SORTS: Array<{ value: NonNullable<ShopLookupQuery["sort"]>; label: string }> = [
  { value: "popular", label: "Popular" },
  { value: "nearest", label: "Nearest" },
  { value: "recent", label: "Newest" },
  { value: "name", label: "A–Z" },
];

const GST_OPTIONS: Array<{
  value: NonNullable<ShopLookupQuery["gstStatus"]>;
  label: string;
}> = [
  { value: "any", label: "Any" },
  { value: "registered", label: "Registered" },
  { value: "unregistered", label: "Unregistered" },
];

export const SupplierFilters: React.FC<Props> = ({ value, onChange }) => {
  const set = (patch: Partial<ShopLookupQuery>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <TextField
        select
        size="small"
        label="Sort"
        value={value.sort ?? "popular"}
        onChange={(e) =>
          set({ sort: e.target.value as ShopLookupQuery["sort"] })
        }
        sx={{ minWidth: 140 }}
      >
        {SORTS.map((s) => (
          <MenuItem key={s.value} value={s.value}>
            {s.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="State"
        value={value.state ?? ""}
        onChange={(e) => set({ state: e.target.value || undefined })}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All states</MenuItem>
        {INDIAN_STATES.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        label="City"
        value={value.city ?? ""}
        onChange={(e) => set({ city: e.target.value || undefined })}
        sx={{ minWidth: 140 }}
      />

      <TextField
        select
        size="small"
        label="GST"
        value={value.gstStatus ?? "any"}
        onChange={(e) =>
          set({
            gstStatus: e.target.value as ShopLookupQuery["gstStatus"],
          })
        }
        sx={{ minWidth: 160 }}
      >
        {GST_OPTIONS.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Kind"
        value={value.kind ?? ""}
        onChange={(e) =>
          set({ kind: (e.target.value as ShopKind | "") || undefined })
        }
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">All</MenuItem>
        {Object.values(ShopKind).map((k) => (
          <MenuItem key={k} value={k}>
            {ShopKindLabel[k]}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
