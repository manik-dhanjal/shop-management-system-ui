import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import {
  SupplierForm,
  INITIAL_SUPPLIER_FORM,
} from "@features/supplier/components/supplier-form.component";
import { useGetSupplier } from "@features/supplier/hooks/use-get-supplier.hook";
import { useUpdateSupplier } from "@features/supplier/hooks/use-update-supplier.hook";
import { useUpdateSupplierShop } from "@features/supplier/hooks/use-update-supplier-shop.hook";
import {
  AddSupplier,
  SupplierFormTypes,
  SupplierShopFormTypes,
} from "@features/supplier/interface/supplier.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";

const EditSupplierPage = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();

  const { data: s, isLoading, isError } = useGetSupplier(supplierId);
  const { mutateAsync: updateLink, isPending: linkSaving } =
    useUpdateSupplier();
  const { mutateAsync: updateShop, isPending: shopSaving } =
    useUpdateSupplierShop();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }
  if (isError || !s) {
    return <div className="p-6 text-red-600">Failed to load supplier.</div>;
  }

  const isExternal = s.shop?.kind === ShopKind.EXTERNAL_SUPPLIER;

  const initial: SupplierFormTypes = {
    ...INITIAL_SUPPLIER_FORM,
    supplierCode: s.supplierCode,
    alias: s.alias,
    status: s.status,
    paymentTerms: s.paymentTerms,
    creditLimit: s.creditLimit ?? 0,
    creditPeriodDays: s.creditPeriodDays ?? 0,
    openingBalance: s.openingBalance ?? 0,
    defaultDiscountPct: s.defaultDiscountPct ?? 0,
    tags: s.tags ?? [],
    notes: s.notes ?? "",
    primaryContact: s.primaryContact ?? { name: "", phone: "", email: "" },
    newShop: isExternal
      ? {
          name: s.shop?.name ?? "",
          location: s.shop?.location,
          gstDetails: s.shop?.gstDetails,
          phone: s.shop?.phone ?? "",
          email: s.shop?.email ?? "",
          alternatePhones: s.shop?.alternatePhones ?? [],
          alternateEmails: s.shop?.alternateEmails ?? [],
          contactPersonName: s.shop?.contactPersonName ?? "",
          contactPersonDesignation: s.shop?.contactPersonDesignation ?? "",
          contactPersons: s.shop?.contactPersons ?? [],
        }
      : INITIAL_SUPPLIER_FORM.newShop,
  };

  const handleSubmit = async (form: SupplierFormTypes) => {
    const {
      newShop,
      supplierShopId: _omit,
      ...linkFields
    } = form;

    const linkPayload: Partial<AddSupplier> = { ...linkFields };
    await updateLink({ supplierId: s._id, payload: linkPayload });

    if (isExternal && newShop) {
      const shopPayload: Partial<SupplierShopFormTypes> = newShop;
      await updateShop({ supplierId: s._id, payload: shopPayload });
    }

    navigate(`/dashboard/supplier/${s._id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Edit Supplier
      </h1>

      {!isExternal && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded-lg p-3 text-sm">
          This is an in-system shop linked as your supplier. Only the
          relationship metadata is editable.
        </div>
      )}

      <SupplierForm
        onSubmit={handleSubmit}
        isLoading={linkSaving || shopSaving}
        initialData={initial}
        linkMetadataOnly={!isExternal}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditSupplierPage;
export { EditSupplierPage };
