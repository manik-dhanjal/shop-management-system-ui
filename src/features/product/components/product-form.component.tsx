import { useForm, SubmitHandler } from "react-hook-form";
import { ProductFormType } from "@features/product/interfaces/product.interface";
import { ProductProperty } from "@features/product/interfaces/product-property.interface";
import TextFieldControlled from "../../../shared/components/form/text-field-controlled.component";
import MenuItem from "@mui/material/MenuItem";
import KeywordInput from "@shared/components/form/keyword-input.component";
import TableInput from "@shared/components/form/table-input.component";
import Button from "@shared/components/form/button.component";
import ProductFeaturedImages from "@features/product/components/product-featured-images.component";
import { Image } from "@shared/interfaces/image.interface";
import NumberInput from "@shared/components/form/number-input.component";
import { Currency } from "@shared/enums/currency.enum";
import { MeasuringUnit } from "@shared/enums/measuring-unit.enum";
import { FormContainer } from "@shared/components/form-container.component";

const INITIAL_PRODUCT_FORM: ProductFormType = {
  name: "",
  description: "",
  sku: "",
  images: [],
  hsn: "",
  brand: "",
  keywords: [],
  properties: [],
  price: 0,
  currency: Currency.INR,
  measuringUnit: MeasuringUnit.PIECES,
  stock: 0,
  igstRate: 0, //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
  cgstRate: 0, //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
  sgstRate: 0, //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
};

interface ProductFormProps {
  formTitle: string;
  initialFormValues?: ProductFormType;
  onSubmit: (product: ProductFormType) => void;
}

export const ProductForm = ({
  formTitle,
  initialFormValues = INITIAL_PRODUCT_FORM,
  onSubmit,
}: ProductFormProps) => {
  // react-hook-form used to control input elements.
  const { control, handleSubmit, watch, setValue } = useForm<ProductFormType>({
    defaultValues: initialFormValues,
  });

  // watch entire form for values used by uncontrolled components
  const formValues = watch();

  const handleNumberChange = (name: string, value: number) => {
    setValue(name as keyof ProductFormType, value);
  };

  const handleKeywordChange = (name: string, value: string[]) => {
    setValue(name as keyof ProductFormType, value);
  };

  const handleTableChange = (name: string, value: ProductProperty[]) => {
    setValue(name as keyof ProductFormType, value);
  };

  const handleImageChange = (images: Image[]) => {
    setValue("images", images);
  };

  const onFormSubmit: SubmitHandler<ProductFormType> = (data) => {
    onSubmit(data);
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex gap-10">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mb-6">
          {formTitle}
        </h1>
        <FormContainer title="Basic Details" className="mb-6">
          <TextFieldControlled
            label="Product Name"
            name="name"
            control={control}
            className="mb-5 w-full"
            required
          />
          <TextFieldControlled
            label="Description"
            name="description"
            control={control}
            className="mb-5 w-full"
            multiline
            rows={4}
          />
          <TextFieldControlled
            label="Brand Name"
            name="brand"
            control={control}
            className="mb-5 w-full"
            required
          />
        </FormContainer>
        <FormContainer
          title="Identifiers"
          className="mb-6"
          childClassName="flex gap-5"
        >
          <TextFieldControlled
            label="SKU"
            name="sku"
            control={control}
            className="w-full"
            required
          />
          <TextFieldControlled
            label="HSN Code"
            name="hsn"
            control={control}
            className="w-full"
            required
          />
        </FormContainer>
        <FormContainer
          title="Inventory"
          className="mb-6"
          childClassName="flex gap-5"
        >
          <TextFieldControlled
            label="Stock Quantity"
            name="stock"
            control={control}
            className="w-full"
            required
          />
          <TextFieldControlled
            label="Measuring Unit"
            name="measuringUnit"
            control={control}
            select
            className="w-full"
            required
          >
            {Object.values(MeasuringUnit).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextFieldControlled>
        </FormContainer>
        <FormContainer
          title="Pricing"
          className="mb-6"
          childClassName="flex gap-5"
        >
          <TextFieldControlled
            label="Price"
            name="price"
            control={control}
            className="w-full"
            required
          />
          <TextFieldControlled
            label="Currency"
            name="currency"
            control={control}
            select
            className="w-full"
            required
          >
            {Object.values(Currency).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextFieldControlled>
        </FormContainer>
        <FormContainer
          title="Tax Rates"
          className="mb-6"
          childClassName="flex gap-5"
        >
          <NumberInput
            label="SGST"
            name="sgstRate"
            control={control}
            onNumberChange={handleNumberChange}
            className="flex-1"
            required
          />
          <NumberInput
            label="CGST"
            name="cgstRate"
            control={control}
            onNumberChange={handleNumberChange}
            className="flex-1"
            required
          />
          <NumberInput
            label="IGST"
            name="igstRate"
            control={control}
            onNumberChange={handleNumberChange}
            className="flex-1"
            required
          />
        </FormContainer>
        <FormContainer title="Additional">
          <KeywordInput
            label="Keywords"
            name="keywords"
            value={formValues.keywords}
            onChange={handleKeywordChange}
            className="mb-5"
          />
          <TableInput
            name="properties"
            onChange={handleTableChange}
            value={formValues.properties}
            label="Properties"
            header={{ name: "Name", value: "Value" }}
            className="mb-5"
          />
        </FormContainer>
      </div>
      <div className="bg-slate-300 w-[1px] dark:bg-gray-800" />
      <div className="w-[330px]">
        <Button type="submit" className="btn-lg w-full">
          Save
        </Button>

        <hr className="mb-6 mt-8 border-slate-300 dark:border-gray-800" />
        <ProductFeaturedImages
          images={formValues.images}
          onChange={handleImageChange}
        />
      </div>
    </form>
  );
};
