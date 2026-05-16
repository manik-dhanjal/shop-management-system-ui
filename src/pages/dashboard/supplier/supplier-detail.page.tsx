import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { IoArrowBack, IoPencil, IoTrash } from "react-icons/io5";
import { useGetSupplier } from "@features/supplier/hooks/use-get-supplier.hook";
import { useDeleteSupplier } from "@features/supplier/hooks/use-delete-supplier.hook";
import { SupplierStatus } from "@shared/enums/supplier-status.enum";
import { ShopKind } from "@shared/enums/shop-kind.enum";
import Modal from "@shared/components/hoc/modal.component";

type Tab = "overview" | "purchases";

const money = (n: number | undefined) =>
  `₹${(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusBadge = (status?: SupplierStatus) => {
  switch (status) {
    case SupplierStatus.ACTIVE:
      return "bg-emerald-100 text-emerald-800";
    case SupplierStatus.BLOCKED:
      return "bg-red-100 text-red-700";
    case SupplierStatus.INACTIVE:
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const SupplierDetailPage = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: s, isLoading, isError } = useGetSupplier(supplierId);
  const { mutate: deleteSupplier } = useDeleteSupplier();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }
  if (isError || !s) {
    return (
      <div className="p-6 text-red-600">Failed to load supplier.</div>
    );
  }

  const isExternal = s.shop?.kind === ShopKind.EXTERNAL_SUPPLIER;
  const gstin = s.shop?.gstDetails?.gstin;
  const phone = s.shop?.phone || s.primaryContact?.phone;
  const email = s.shop?.email || s.primaryContact?.email;

  return (
    <div className="space-y-4">
      <button
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline"
        onClick={() => navigate("/dashboard/supplier/all")}
      >
        <IoArrowBack /> Back to suppliers
      </button>

      {/* Header card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {s.shop?.name}
              </h1>
              {s.supplierCode && (
                <span className="font-mono text-xs text-gray-500">
                  {s.supplierCode}
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded ${statusBadge(s.status)}`}
              >
                {s.status}
              </span>
              {gstin && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-700">
                  {gstin}
                </span>
              )}
              {!isExternal && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  IN-SYSTEM SHOP
                </span>
              )}
            </div>
            {s.shop?.gstDetails?.legalName &&
              s.shop.gstDetails.legalName !== s.shop?.name && (
                <div className="text-sm text-gray-500">
                  {s.shop.gstDetails.legalName}
                </div>
              )}
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {phone}
              {email && ` · ${email}`}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="small"
              startIcon={<IoPencil />}
              onClick={() =>
                navigate(`/dashboard/supplier/${s._id}/edit`)
              }
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<IoTrash />}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Stat label="Lifetime ₹" value={money(s.stats?.totalPurchased)} />
          <Stat label="Orders" value={(s.stats?.totalOrders ?? 0).toString()} />
          <Stat label="Avg. Order" value={money(s.stats?.avgOrderValue)} />
          <Stat
            label="Outstanding Payable"
            value={money(s.stats?.outstandingPayable)}
            danger={(s.stats?.outstandingPayable ?? 0) > 0}
          />
        </div>
      </div>

      {!isExternal && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded-lg p-3 text-sm">
          This supplier is an in-system shop. Only the relationship metadata
          (terms, alias, tags, notes) is editable — identity, contact, and
          address are owned by the supplier shop itself.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>
          Overview
        </TabBtn>
        <TabBtn active={tab === "purchases"} onClick={() => setTab("purchases")}>
          Purchases ({s.stats?.totalOrders ?? 0})
        </TabBtn>
      </div>

      {tab === "overview" && <OverviewTab s={s} />}
      {tab === "purchases" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-sm text-gray-500">
          Purchase Orders will appear here once the PO module ships.
        </div>
      )}

      {confirmDelete && (
        <Modal title="Remove supplier" onClose={() => setConfirmDelete(false)}>
          <div className="space-y-3 text-sm">
            <p>
              {(s.stats?.totalOrders ?? 0) === 0 &&
              (s.stats?.outstandingPayable ?? 0) === 0
                ? `Unlink ${s.shop?.name}? No purchases recorded and zero outstanding.`
                : `Deactivate ${s.shop?.name}? They have ${s.stats?.totalOrders ?? 0} order(s) and ${money(s.stats?.outstandingPayable)} payable. History is preserved.`}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setConfirmDelete(false)} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteSupplier(s._id);
                  setConfirmDelete(false);
                  navigate("/dashboard/supplier/all");
                }}
                color="error"
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Stat: React.FC<{
  label: string;
  value: string;
  danger?: boolean;
}> = ({ label, value, danger }) => (
  <div>
    <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
      {label}
    </div>
    <div
      className={`text-lg font-semibold mt-0.5 ${
        danger ? "text-red-600" : "text-gray-900 dark:text-gray-50"
      }`}
    >
      {value}
    </div>
  </div>
);

const TabBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium transition-colors ${
      active
        ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
    }`}
  >
    {children}
  </button>
);

const OverviewTab: React.FC<{ s: any }> = ({ s }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card title="Contact">
      <Row label="Phone" value={s.shop?.phone} />
      <Row label="Email" value={s.shop?.email} />
      <Row label="Contact Person" value={s.shop?.contactPersonName} />
      <Row label="Designation" value={s.shop?.contactPersonDesignation} />
      {(s.shop?.alternatePhones?.length ?? 0) > 0 && (
        <Row
          label="Alt. Phones"
          value={s.shop.alternatePhones.join(", ")}
        />
      )}
      {(s.shop?.alternateEmails?.length ?? 0) > 0 && (
        <Row
          label="Alt. Emails"
          value={s.shop.alternateEmails.join(", ")}
        />
      )}
    </Card>

    <Card title="GST & Tax">
      <Row label="GSTIN" value={s.shop?.gstDetails?.gstin} mono />
      <Row label="Legal Name" value={s.shop?.gstDetails?.legalName} />
      <Row label="PAN" value={s.shop?.gstDetails?.panCardNumber} mono />
      <Row label="State" value={s.shop?.gstDetails?.state} />
    </Card>

    <Card title="Address">
      <Row label="Address" value={s.shop?.location?.address} />
      {s.shop?.location?.addressLine2 && (
        <Row label="" value={s.shop.location.addressLine2} />
      )}
      <Row label="City" value={s.shop?.location?.city} />
      <Row label="State" value={s.shop?.location?.state} />
      <Row label="Pincode" value={s.shop?.location?.pinCode} />
      <Row label="Country" value={s.shop?.location?.country} />
    </Card>

    <Card title="Business Terms">
      <Row label="Payment Terms" value={s.paymentTerms} />
      <Row label="Credit Limit" value={`₹${s.creditLimit ?? 0}`} />
      <Row label="Credit Period" value={`${s.creditPeriodDays ?? 0} days`} />
      <Row label="Opening Balance" value={`₹${s.openingBalance ?? 0}`} />
      <Row label="Default Discount" value={`${s.defaultDiscountPct ?? 0}%`} />
    </Card>

    {(s.notes || (s.tags?.length ?? 0) > 0) && (
      <Card title="Notes & Tags" wide>
        {s.notes && (
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
            {s.notes}
          </p>
        )}
        {s.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {s.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </Card>
    )}
  </div>
);

const Card: React.FC<{
  title: string;
  wide?: boolean;
  children: React.ReactNode;
}> = ({ title, wide, children }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-xl p-4 ${
      wide ? "md:col-span-2" : ""
    }`}
  >
    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
      {title}
    </h3>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const Row: React.FC<{ label: string; value?: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-2 text-sm">
      {label && (
        <div className="text-xs uppercase text-gray-400 w-32 flex-shrink-0">
          {label}
        </div>
      )}
      <div
        className={`text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </div>
    </div>
  );
};

export default SupplierDetailPage;
export { SupplierDetailPage };
