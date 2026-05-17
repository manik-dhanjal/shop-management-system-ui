import { useNavigate } from "react-router-dom";
import { useAddShop } from "@features/shop/hooks/use-add-shop.hook";
import {
  ShopEditForm,
  ShopEditFormValues,
} from "@features/shop/components/shop-edit-form.component";

const AddShopPage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useAddShop();

  const handleSubmit = async (values: ShopEditFormValues) => {
    const created = await mutateAsync(values);
    navigate(`/dashboard/shop/${created._id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Add Shop
      </h1>
      <ShopEditForm
        initial={{}}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Create Shop"
      />
    </div>
  );
};

export default AddShopPage;
export { AddShopPage };
