import { Button, IconButton } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { SupplierShopLookup } from "@features/supplier/interface/supplier.interface";

interface Props {
  shops: SupplierShopLookup[];
  onRemove: (shopId: string) => void;
  onClear: () => void;
  onLink: (shop: SupplierShopLookup) => void;
}

/**
 * Side-by-side comparison drawer pinned to the bottom of the find-supplier
 * panel. Renders only when 2+ shops are checked. Max 3 enforced by the
 * orchestrator.
 */
export const SupplierCompareTray: React.FC<Props> = ({
  shops,
  onRemove,
  onClear,
  onLink,
}) => {
  if (shops.length < 2) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Compare ({shops.length})</div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-500 hover:underline"
        >
          Clear
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 uppercase">
              <th className="py-1 pr-3">Field</th>
              {shops.map((s) => (
                <th key={s._id} className="py-1 pr-3 min-w-[140px]">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{s.name}</span>
                    <IconButton
                      size="small"
                      aria-label="Remove"
                      onClick={() => onRemove(s._id)}
                    >
                      <IoClose className="text-sm" />
                    </IconButton>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            <Row label="Phone" pick={(s) => s.phone} shops={shops} />
            <Row
              label="GSTIN"
              pick={(s) => s.gstDetails?.gstin}
              shops={shops}
              mono
            />
            <Row
              label="Legal name"
              pick={(s) => s.gstDetails?.legalName}
              shops={shops}
            />
            <Row label="State" pick={(s) => s.location?.state} shops={shops} />
            <Row label="City" pick={(s) => s.location?.city} shops={shops} />
            <Row
              label="Linked by"
              pick={(s) => String(s.linkedByCount ?? 0)}
              shops={shops}
            />
            <tr>
              <td className="py-2 pr-3 text-gray-400 uppercase">Action</td>
              {shops.map((s) => (
                <td key={s._id} className="py-2 pr-3">
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!!s.alreadyLinked}
                    onClick={() => onLink(s)}
                    fullWidth
                  >
                    {s.alreadyLinked ? "Linked" : "Link"}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  pick: (s: SupplierShopLookup) => string | undefined;
  shops: SupplierShopLookup[];
  mono?: boolean;
}> = ({ label, pick, shops, mono }) => (
  <tr>
    <td className="py-2 pr-3 text-gray-400 uppercase">{label}</td>
    {shops.map((s) => (
      <td
        key={s._id}
        className={`py-2 pr-3 text-gray-800 dark:text-gray-100 truncate ${
          mono ? "font-mono" : ""
        }`}
      >
        {pick(s) || "—"}
      </td>
    ))}
  </tr>
);
