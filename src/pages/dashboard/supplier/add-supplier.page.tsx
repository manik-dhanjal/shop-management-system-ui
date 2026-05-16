import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SupplierForm } from "@features/supplier/components/supplier-form.component";
import { FindSupplierPanel } from "@features/supplier/components/find-supplier.panel";
import { useAddSupplier } from "@features/supplier/hooks/use-add-supplier.hook";
import { useShopPreview } from "@features/supplier/hooks/use-shop-preview.hook";
import {
  AddSupplier,
  SupplierShopLookup,
  SupplierFormTypes,
} from "@features/supplier/interface/supplier.interface";

type Tab = "create" | "link";

const AddSupplierPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const linkShopIdParam = searchParams.get("linkShopId") || undefined;

  const [tab, setTab] = useState<Tab>(
    linkShopIdParam ? "link" : "create",
  );
  const [picked, setPicked] = useState<SupplierShopLookup | null>(null);
  const { mutateAsync, isPending } = useAddSupplier();

  // If we landed here via Browse Suppliers (?linkShopId=…), preselect that shop.
  const { data: preview } = useShopPreview(linkShopIdParam);
  useEffect(() => {
    if (linkShopIdParam && preview && !picked) {
      setPicked({
        _id: preview._id,
        name: preview.name,
        kind: preview.kind,
        phone: preview.phone,
        email: preview.email,
        gstDetails: preview.gstDetails,
        location: preview.location,
        linkedByCount: preview.linkedByCount,
        alreadyLinked: preview.alreadyLinked,
      });
      // strip the query param once consumed
      const next = new URLSearchParams(searchParams);
      next.delete("linkShopId");
      setSearchParams(next, { replace: true });
    }
  }, [linkShopIdParam, preview, picked, searchParams, setSearchParams]);

  const submitCreate = async (form: SupplierFormTypes) => {
    const payload: AddSupplier = {
      ...form,
      newShop: form.newShop,
      supplierShopId: undefined,
    };
    const created = await mutateAsync(payload);
    navigate(`/dashboard/supplier/${created._id}`);
  };

  const submitLink = async (form: SupplierFormTypes) => {
    if (!picked) return;
    const payload: AddSupplier = {
      ...form,
      newShop: undefined,
      supplierShopId: picked._id,
    };
    const created = await mutateAsync(payload);
    navigate(`/dashboard/supplier/${created._id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Add Supplier
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <TabBtn
          active={tab === "create"}
          onClick={() => {
            setTab("create");
            setPicked(null);
          }}
        >
          Create New Supplier
        </TabBtn>
        <TabBtn
          active={tab === "link"}
          onClick={() => setTab("link")}
        >
          Link Existing Shop
        </TabBtn>
      </div>

      {tab === "create" && (
        <SupplierForm onSubmit={submitCreate} isLoading={isPending} />
      )}

      {tab === "link" && !picked && (
        <FindSupplierPanel onConfirmLink={(s) => setPicked(s)} />
      )}

      {tab === "link" && picked && (
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200 rounded-lg p-3 text-sm flex items-center justify-between">
            <div>
              Linking <b>{picked.name}</b>
              {picked.phone && <> · {picked.phone}</>}
              {picked.gstDetails?.gstin && (
                <> · <span className="font-mono">{picked.gstDetails.gstin}</span></>
              )}
            </div>
            <button
              type="button"
              className="text-xs underline"
              onClick={() => setPicked(null)}
            >
              change
            </button>
          </div>
          <SupplierForm
            onSubmit={submitLink}
            isLoading={isPending}
            linkMetadataOnly
            submitLabel="Link Supplier"
          />
        </div>
      )}
    </div>
  );
};

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

export default AddSupplierPage;
export { AddSupplierPage };
