import { ProductFormType } from "@features/product/interfaces/product.interface";
import { omit as _omit } from "lodash";
import { useAddProduct } from "@features/product/hooks/use-add-product.hook";
import { ProductForm } from "@features/product/components/product-form.component";

const AddProductPage = () => {
  const { mutate } = useAddProduct();
  const handleSave = async (product: ProductFormType) => {
    mutate(product);
  };
  return <ProductForm formTitle="Add new product" onSubmit={handleSave} />;
};

export default AddProductPage;
