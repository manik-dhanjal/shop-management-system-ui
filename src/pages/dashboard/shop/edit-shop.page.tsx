import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useGetShop } from "@features/shop/hooks/use-get-shop.hook";
import { useUpdateShop } from "@features/shop/hooks/use-update-shop.hook";
import {
  ShopEditForm,
  ShopEditFormValues,
} from "@features/shop/components/shop-edit-form.component";
import { UserRole } from "@shared/enums/user-role.enum";

const EditShopPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { data: shop, isLoading, isError } = useGetShop(shopId);
  const { mutateAsync, isPending } = useUpdateShop();

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

  const isAdmin = (shop.myRoles ?? []).includes(UserRole.ADMIN);
  if (!isAdmin) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded-lg p-4 text-sm">
        You don't have admin access to this shop.
      </div>
    );
  }

  const handleSubmit = async (values: ShopEditFormValues) => {
    await mutateAsync({ shopId: shop._id, payload: values });
    navigate(`/dashboard/shop/${shop._id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Edit Shop
      </h1>
      <ShopEditForm
        initial={shop as ShopEditFormValues}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
};

export default EditShopPage;
export { EditShopPage };
