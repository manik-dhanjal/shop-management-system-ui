import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { IoPencil, IoTrash } from "react-icons/io5";
import { useGetCustomer } from "@features/customer/hooks/use-get-customer.hook";
import { useDeleteCustomer } from "@features/customer/hooks/use-delete-customer.hook";
import { useGetPaginatedOrders } from "@features/order/hooks/use-get-paginated-orders.hook";
import Modal from "@shared/components/hoc/modal.component";
import { CustomerStatus } from "@shared/enums/customer-status.enum";
import { GstRegistrationTypeLabel } from "@shared/enums/gst-registration-type.enum";
import { PaymentTermsLabel } from "@shared/enums/payment-terms.enum";

const money = (n?: number) =>
  `₹${(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-IN") : "—";

const statusColor = (s?: CustomerStatus) => {
  switch (s) {
    case CustomerStatus.ACTIVE:
      return "bg-emerald-100 text-emerald-800";
    case CustomerStatus.BLOCKED:
      return "bg-red-100 text-red-700";
    case CustomerStatus.INACTIVE:
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

type Tab = "overview" | "orders";

export const CustomerDetailPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [showDelete, setShowDelete] = useState(false);

  const { data: c, isLoading, isError } = useGetCustomer(customerId || "");
  const { mutate: deleteCustomer } = useDeleteCustomer();

  if (!customerId) {
    navigate("/404");
    return null;
  }

  if (isLoading)
    return (
      <div className="flex flex-col gap-5 items-center justify-center py-16">
        <CircularProgress />
        <div>Loading customer…</div>
      </div>
    );
  if (isError || !c)
    return <div className="p-6 text-red-600">Unable to load customer</div>;

  return (
    <div className="space-y-4">
      {/* Back link */}
      <button
        onClick={() => navigate("/dashboard/customer/all")}
        className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
      >
        ← Back to customers
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {c.name}
              </h1>
              {c.customerCode && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                  {c.customerCode}
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded ${statusColor(
                  c.status,
                )}`}
              >
                {c.status ?? "—"}
              </span>
              {c.gstin && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                  GSTIN {c.gstin}
                </span>
              )}
              {(c.tags ?? []).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800"
                >
                  {t}
                </span>
              ))}
            </div>
            {c.legalName && c.legalName !== c.name && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {c.legalName}
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {c.phone}
              {c.email ? ` · ${c.email}` : ""}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="small"
              startIcon={<IoPencil />}
              onClick={() =>
                navigate(`/dashboard/customer/${customerId}/edit`)
              }
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<IoTrash />}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <Stat label="Lifetime ₹" value={money(c.stats?.totalBilled)} />
          <Stat label="Orders" value={`${c.stats?.totalOrders ?? 0}`} />
          <Stat label="Avg. Order" value={money(c.stats?.avgOrderValue)} />
          <Stat
            label="Outstanding"
            value={money(c.stats?.outstandingBalance)}
            negative={(c.stats?.outstandingBalance ?? 0) > 0}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-1">
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
            label="Overview"
          />
          <TabButton
            active={tab === "orders"}
            onClick={() => setTab("orders")}
            label={`Orders (${c.stats?.totalOrders ?? 0})`}
          />
        </nav>
      </div>

      {tab === "overview" && <OverviewTab c={c as any} />}
      {tab === "orders" && <OrdersTab customerId={customerId} />}

      {/* Delete confirmation */}
      {showDelete && (
        <Modal title="Delete customer" onClose={() => setShowDelete(false)}>
          <div className="space-y-3 text-sm">
            <p>
              {(c.stats?.totalOrders ?? 0) === 0 &&
              (c.stats?.outstandingBalance ?? 0) === 0 ? (
                <>
                  Permanently delete <b>{c.name}</b>? They have no orders.
                </>
              ) : (
                <>
                  Deactivate <b>{c.name}</b>? Order history will be preserved
                  ({c.stats?.totalOrders ?? 0} order(s),{" "}
                  {money(c.stats?.outstandingBalance)} outstanding).
                </>
              )}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setShowDelete(false)} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={() =>
                  deleteCustomer(customerId, {
                    onSuccess: () => navigate("/dashboard/customer/all"),
                  })
                }
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

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      active
        ? "border-violet-600 text-violet-600 dark:text-violet-400"
        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900"
    }`}
  >
    {label}
  </button>
);

const Stat: React.FC<{
  label: string;
  value: string;
  negative?: boolean;
}> = ({ label, value, negative }) => (
  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-3">
    <div className="text-xs uppercase text-gray-500">{label}</div>
    <div
      className={`text-xl font-semibold mt-1 ${
        negative
          ? "text-red-600"
          : "text-gray-900 dark:text-gray-50"
      }`}
    >
      {value}
    </div>
  </div>
);

const OverviewTab: React.FC<{ c: any }> = ({ c }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <Card title="Contact">
      <Row k="Phone" v={c.phone} />
      {c.email && <Row k="Email" v={c.email} />}
      {(c.alternatePhones ?? []).length > 0 && (
        <Row k="Alt. phones" v={c.alternatePhones.join(", ")} />
      )}
      {c.contactPersonName && (
        <Row
          k="Contact Person"
          v={`${c.contactPersonName}${
            c.contactPersonDesignation ? ` · ${c.contactPersonDesignation}` : ""
          }`}
        />
      )}
      <Row k="Source" v={c.source ?? "—"} />
    </Card>

    <Card title="GST & Tax">
      <Row k="Type" v={c.type ?? "—"} />
      <Row
        k="Registration"
        v={
          c.gstRegistrationType
            ? GstRegistrationTypeLabel[
                c.gstRegistrationType as keyof typeof GstRegistrationTypeLabel
              ]
            : "—"
        }
      />
      <Row k="GSTIN" v={c.gstin ?? "—"} />
      <Row k="PAN" v={c.pan ?? "—"} />
      <Row
        k="Place of Supply"
        v={c.placeOfSupplyStateCode ?? "—"}
      />
      {c.reverseChargeApplicable && <Row k="RCM" v="Applicable" />}
      {c.isExempt && <Row k="Exempt" v="Yes" />}
    </Card>

    <Card title="Billing Address">
      {c.billingAddress ? (
        <AddressBlock a={c.billingAddress} />
      ) : (
        <p className="text-gray-400 text-sm">No billing address.</p>
      )}
    </Card>

    <Card title="Shipping Address">
      {c.shippingAddress || (c.shippingAddresses ?? []).length > 0 ? (
        <AddressBlock
          a={
            c.shippingAddress ||
            c.shippingAddresses[c.defaultShippingAddressIndex ?? 0]
          }
        />
      ) : (
        <p className="text-gray-400 text-sm">Same as billing.</p>
      )}
    </Card>

    <Card title="Business Terms">
      <Row k="Credit Limit" v={money(c.creditLimit)} />
      <Row k="Credit Period" v={`${c.creditPeriodDays ?? 0} days`} />
      <Row
        k="Payment Terms"
        v={
          c.paymentTerms
            ? PaymentTermsLabel[c.paymentTerms as keyof typeof PaymentTermsLabel]
            : "—"
        }
      />
      <Row k="Opening Balance" v={money(c.openingBalance)} />
      <Row k="Default Discount" v={`${c.discountPercentDefault ?? 0}%`} />
      <Row k="Currency" v={c.currency ?? "INR"} />
    </Card>

    <Card title="Important Dates & Notes">
      <Row k="First Order" v={formatDate(c.stats?.firstOrderAt)} />
      <Row k="Last Order" v={formatDate(c.stats?.lastOrderAt)} />
      {c.birthday && <Row k="Birthday" v={formatDate(c.birthday)} />}
      {c.anniversary && (
        <Row k="Anniversary" v={formatDate(c.anniversary)} />
      )}
      {c.notes && (
        <div className="mt-3 text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {c.notes}
        </div>
      )}
    </Card>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl">
    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700/60">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
    </div>
    <div className="p-4 space-y-1">{children}</div>
  </div>
);

const Row: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{k}</span>
    <span className="text-gray-900 dark:text-gray-100 text-right">{v}</span>
  </div>
);

const AddressBlock: React.FC<{ a: any }> = ({ a }) => (
  <div className="text-sm text-gray-700 dark:text-gray-300">
    <div>{a.address}</div>
    {a.addressLine2 && <div>{a.addressLine2}</div>}
    <div>
      {[a.city, a.state, a.pinCode].filter(Boolean).join(", ")}
      {a.stateCode ? ` (${a.stateCode})` : ""}
    </div>
    {a.country && <div className="text-gray-500">{a.country}</div>}
  </div>
);

const OrdersTab: React.FC<{ customerId: string }> = ({ customerId }) => {
  // Filter the orders endpoint by this customer. The paginated hook accepts a
  // `filter` field; we pass `{ customer: id }` so the backend narrows the query.
  const { data, isLoading } = useGetPaginatedOrders(20, 1, {
    customer: customerId,
  } as any);

  if (isLoading)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex justify-center">
        <CircularProgress />
      </div>
    );
  const docs = data?.docs ?? [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
      {docs.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          No orders yet.
        </div>
      ) : (
        <table className="table-auto w-full text-sm">
          <thead className="text-xs uppercase text-gray-400 bg-gray-50 dark:bg-gray-700/40">
            <tr>
              <th className="p-2 text-left">Invoice</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2 text-center">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {docs.map((o: any) => (
              <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="p-2 font-mono">{o.invoiceId}</td>
                <td className="p-2 text-blue-500">{o.invoiceType}</td>
                <td className="p-2 text-right">
                  ₹{(o.billing?.finalAmount ?? 0).toFixed(2)}
                </td>
                <td className="p-2 text-center text-xs">
                  {formatDate(o.orderDate || o.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerDetailPage;
