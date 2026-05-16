import { Button, CircularProgress } from "@mui/material";
import { useShopPreview } from "@features/supplier/hooks/use-shop-preview.hook";
import { ShopKind } from "@shared/enums/shop-kind.enum";

interface Props {
  targetShopId?: string;
  onConfirmLink: (preview: NonNullable<ReturnType<typeof useShopPreview>["data"]>) => void;
}

export const SupplierPreviewPanel: React.FC<Props> = ({
  targetShopId,
  onConfirmLink,
}) => {
  const { data, isLoading, isError } = useShopPreview(targetShopId);

  if (!targetShopId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-sm text-gray-500 h-full flex items-center justify-center">
        Pick a supplier on the left to preview them here.
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex justify-center items-center h-full">
        <CircularProgress size={20} />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-sm text-red-600 h-full">
        Failed to load preview.
      </div>
    );
  }

  const gstin = data.gstDetails?.gstin;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3 h-full overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
            {data.name}
          </div>
          <div className="text-xs text-gray-500 flex flex-wrap gap-2 mt-1">
            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
              {data.kind === ShopKind.EXTERNAL_SUPPLIER
                ? "External supplier"
                : "In-system shop"}
            </span>
            {gstin && (
              <span className="font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                {gstin}
              </span>
            )}
            <span className="text-gray-500">
              Linked by {data.linkedByCount} shop
              {data.linkedByCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      <Row label="Phone" value={data.phone} />
      <Row label="Email" value={data.email} />
      <Row label="Contact" value={data.contactPersonName} />
      <Row label="Designation" value={data.contactPersonDesignation} />
      <Row
        label="Address"
        value={
          [
            data.location?.address,
            data.location?.city,
            data.location?.state,
            data.location?.pinCode,
          ]
            .filter(Boolean)
            .join(", ") || undefined
        }
      />
      <Row label="Legal name" value={data.gstDetails?.legalName} />
      <Row label="PAN" value={data.gstDetails?.panCardNumber} mono />

      <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
        {data.alreadyLinked ? (
          <div className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded p-2">
            This shop is already linked as your supplier.
          </div>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={() => onConfirmLink(data)}
          >
            Link supplier →
          </Button>
        )}
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value?: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => {
  if (!value) return null;
  return (
    <div className="text-sm">
      <span className="text-xs uppercase text-gray-400 mr-2">{label}</span>
      <span
        className={`text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
};
