import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { IoArrowBack, IoPencil, IoTrash } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";
import { useGetShop } from "@features/shop/hooks/use-get-shop.hook";
import { useDeleteShop } from "@features/shop/hooks/use-delete-shop.hook";
import { useShop } from "@shared/hooks/shop.hook";
import { useAuth } from "@shared/hooks/auth.hooks";
import { useRecentShops } from "@features/shop/hooks/use-recent-shops.hook";
import { UserRole, UserRoleLabel } from "@shared/enums/user-role.enum";
import { ShopStatus } from "@shared/enums/shop-status.enum";
import { ShopMembersTab } from "@features/shop/components/shop-members-tab.component";

type Tab = "overview" | "team" | "settings" | "danger";

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: shop, isLoading, isError } = useGetShop(shopId);
  const { mutate: deleteShop } = useDeleteShop();
  const { activeShop } = useShop();
  const { setActiveShop } = useAuth();
  const { recordSwitch } = useRecentShops();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }
  if (isError || !shop) {
    return <div className="p-6 text-red-600">Failed to load shop.</div>;
  }

  const isActive = activeShop?._id === shop._id;
  const isAdmin = (shop.myRoles ?? []).includes(UserRole.ADMIN);
  const gstin = shop.gstDetails?.gstin;

  const handleSwitch = () => {
    if (setActiveShop(shop._id)) {
      recordSwitch(shop._id, shop.name);
    }
  };

  return (
    <div className="space-y-4">
      <button
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline"
        onClick={() => navigate("/dashboard/shop/all")}
      >
        <IoArrowBack /> My Shops
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {shop.name}
              </h1>
              <Badge color="bg-gray-200 text-gray-700">{shop.kind}</Badge>
              <Badge
                color={
                  shop.status === ShopStatus.ACTIVE
                    ? "bg-emerald-100 text-emerald-800"
                    : shop.status === ShopStatus.SUSPENDED
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-700"
                }
              >
                {shop.status}
              </Badge>
              {gstin && (
                <Badge color="bg-violet-100 text-violet-700 font-mono">
                  {gstin}
                </Badge>
              )}
              {(shop.myRoles ?? []).map((r) => (
                <Badge key={r} color="bg-blue-100 text-blue-700">
                  {UserRoleLabel[r] ?? r}
                </Badge>
              ))}
              {isActive && (
                <Badge color="bg-violet-500 text-white">
                  ✓ You are here
                </Badge>
              )}
            </div>
            {shop.description && (
              <div className="text-sm text-gray-500 mt-1">
                {shop.description}
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {shop.location?.city}
              {shop.location?.state && `, ${shop.location.state}`}
            </div>
          </div>
          <div className="flex gap-2">
            {!isActive && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleSwitch}
              >
                Switch to this shop
              </Button>
            )}
            {isAdmin && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IoPencil />}
                  onClick={() =>
                    navigate(`/dashboard/shop/${shop._id}/edit`)
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>
          Overview
        </TabBtn>
        <TabBtn active={tab === "team"} onClick={() => setTab("team")}>
          Team & Roles
        </TabBtn>
        <TabBtn active={tab === "settings"} onClick={() => setTab("settings")}>
          Settings
        </TabBtn>
        {isAdmin && (
          <TabBtn active={tab === "danger"} onClick={() => setTab("danger")}>
            Danger
          </TabBtn>
        )}
      </div>

      {tab === "overview" && <OverviewTab shop={shop} />}
      {tab === "team" && (
        <ShopMembersTab shopId={shop._id} isAdmin={isAdmin} />
      )}
      {tab === "settings" && (
        <Card title="Preferences">
          <Row label="Currency" value={shop.currency} />
          <Row label="Timezone" value={shop.timezone} />
          <Row label="Billing Email" value={shop.billingEmail} />
          {isAdmin && (
            <div className="pt-3 text-xs text-gray-500">
              Editable from{" "}
              <button
                className="underline"
                onClick={() => navigate(`/dashboard/shop/${shop._id}/edit`)}
              >
                Edit Shop
              </button>
              .
            </div>
          )}
        </Card>
      )}
      {tab === "danger" && isAdmin && (
        <Card title="Danger Zone">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Deleting a shop hides it for everyone and removes their access.
            Order history is preserved but the shop cannot be deleted while it
            has orders — mark it Inactive instead.
          </p>
          <Button
            color="error"
            variant="outlined"
            startIcon={<IoTrash />}
            onClick={() => setConfirmDelete(true)}
          >
            Delete this shop
          </Button>
        </Card>
      )}

      {confirmDelete && (
        <Modal title="Delete shop" onClose={() => setConfirmDelete(false)}>
          <div className="space-y-3 text-sm">
            <p>
              Delete <b>{shop.name}</b>? All members lose access; the shop is
              hidden from listings. Cannot be undone from the UI.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setConfirmDelete(false)} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteShop(shop._id, {
                    onSuccess: () => navigate("/dashboard/shop/all"),
                  });
                  setConfirmDelete(false);
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

const OverviewTab: React.FC<{ shop: any }> = ({ shop }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card title="Contact">
      <Row label="Phone" value={shop.phone} />
      <Row label="Email" value={shop.email} />
      <Row label="Contact Person" value={shop.contactPersonName} />
      <Row label="Designation" value={shop.contactPersonDesignation} />
    </Card>
    <Card title="GST & Tax">
      <Row label="GSTIN" value={shop.gstDetails?.gstin} mono />
      <Row label="Legal Name" value={shop.gstDetails?.legalName} />
      <Row label="PAN" value={shop.gstDetails?.panCardNumber} mono />
      <Row label="State" value={shop.gstDetails?.state} />
    </Card>
    <Card title="Address">
      <Row label="Address" value={shop.location?.address} />
      <Row label="City" value={shop.location?.city} />
      <Row label="State" value={shop.location?.state} />
      <Row label="Pincode" value={shop.location?.pinCode} />
      <Row label="Country" value={shop.location?.country} />
    </Card>
    <Card title="Branding">
      {shop.logo ? (
        <img
          src={(shop.logo as any)?.secureUrl ?? (shop.logo as any)?.url}
          alt="logo"
          className="w-20 h-20 rounded object-cover"
        />
      ) : (
        <div className="text-sm text-gray-500">No logo uploaded.</div>
      )}
      {shop.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
          {shop.description}
        </p>
      )}
    </Card>
  </div>
);

const Badge: React.FC<{ color: string; children: React.ReactNode }> = ({
  color,
  children,
}) => (
  <span className={`text-xs px-2 py-0.5 rounded ${color}`}>{children}</span>
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

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
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
      <div className="text-xs uppercase text-gray-400 w-32 flex-shrink-0">
        {label}
      </div>
      <div
        className={`text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </div>
    </div>
  );
};

export default ShopDetailPage;
export { ShopDetailPage };
