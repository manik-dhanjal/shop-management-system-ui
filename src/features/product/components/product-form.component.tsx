import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import { TextFieldControlled } from "@shared/components/form/text-field-controlled.component";
import { ProductFormType } from "@features/product/interfaces/product.interface";
import { ProductProperty } from "@features/product/interfaces/product-property.interface";
import KeywordInput from "@shared/components/form/keyword-input.component";
import TableInput from "@shared/components/form/table-input.component";
import ProductFeaturedImages from "@features/product/components/product-featured-images.component";
import { Image } from "@shared/interfaces/image.interface";
import Button from "@mui/material/Button";
import SectionBlock from "@shared/components/section-block";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { ProductInventoryTable } from "./product-inventory-table";

const INITIAL_PRODUCT_FORM: ProductFormType = {
  name: "",
  description: "",
  sku: "",
  images: [],
  hsn: "",
  brand: "",
  keywords: [],
  properties: [],
  igstRate: 0,
  cgstRate: 0,
  sgstRate: 0,
  inventory: [],
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
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required("Product Name is required"),
        brand: yup.string().required("Brand is required"),
        sku: yup.string().required("SKU is required"),
        hsn: yup.string().required("HSN Code is required"),
        description: yup.string().optional(),
        sgstRate: yup
          .number()
          .typeError("SGST must be a number")
          .min(0, "SGST cannot be negative")
          .required("SGST is required"),
        cgstRate: yup
          .number()
          .typeError("CGST must be a number")
          .min(0, "CGST cannot be negative")
          .required("CGST is required"),
        igstRate: yup
          .number()
          .typeError("IGST must be a number")
          .min(0, "IGST cannot be negative")
          .required("IGST is required"),
      }),
    []
  );

  const resolver = useYupValidationResolver(validationSchema);
  const { control, handleSubmit } = useForm<ProductFormType>({
    resolver,
    defaultValues: initialFormValues ?? INITIAL_PRODUCT_FORM,
  });

  // Local state for complex, non-MUI controlled components
  const [images, setImages] = useState<Image[]>(initialFormValues.images ?? []);
  const [keywords, setKeywords] = useState<string[]>(
    initialFormValues.keywords ?? []
  );
  const [properties, setProperties] = useState<ProductProperty[]>(
    initialFormValues.properties ?? []
  );

  const [inventory, setInventory] = useState(initialFormValues.inventory ?? []);

  const onFormSubmit = (data: ProductFormType) => {
    onSubmit({ ...data, images, keywords, properties, inventory });
  };

  return (
    <form className="" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Breadcrumbs>
            <Link underline="hover" color="inherit" href="/">
              Dashboard
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/material-ui/getting-started/installation/"
            >
              Products
            </Link>
            <Typography sx={{ color: "text.primary" }}>Add</Typography>
          </Breadcrumbs>
        </div>
        <Button variant="contained" color="primary" size="large" type="submit">
          Save Product
        </Button>
      </div>
      <div className="flex gap-8 mb-8">
        <div className="flex-1 gap-8 flex flex-col">
          <SectionBlock title="Product Details" className="w-full">
            <div className="flex flex-col gap-6">
              <TextFieldControlled
                label="Product Name"
                name="name"
                control={control}
                className="w-full"
                placeholder="Enter product name"
              />
              <TextFieldControlled
                label="Description"
                name="description"
                control={control}
                className="mb-5 w-full"
                placeholder="Enter description"
                multiline
                minRows={3}
              />
              <TextFieldControlled
                label="Brand Name"
                name="brand"
                control={control}
                className="mb-5 w-full"
                placeholder="Enter brand name"
              />
              <div className="flex gap-5">
                <TextFieldControlled
                  label="SKU"
                  name="sku"
                  control={control}
                  className="flex-1"
                  placeholder="Enter SKU"
                />
                <TextFieldControlled
                  label="HSN Code"
                  name="hsn"
                  control={control}
                  className="flex-1"
                  placeholder="Enter HSN code"
                />
              </div>
              <div className="flex gap-5">
                <TextFieldControlled
                  label="SGST"
                  name="sgstRate"
                  control={control}
                  type="number"
                  className="flex-1"
                  placeholder="0"
                />
                <TextFieldControlled
                  label="CGST"
                  name="cgstRate"
                  control={control}
                  type="number"
                  className="flex-1"
                  placeholder="0"
                />
                <TextFieldControlled
                  label="IGST"
                  name="igstRate"
                  control={control}
                  type="number"
                  className="flex-1"
                  placeholder="0"
                />
              </div>
            </div>
          </SectionBlock>
          <TableInput
            name="properties"
            onChange={(_, v) => setProperties(v)}
            value={properties}
            label="Properties"
            header={{ name: "Name", value: "Value" }}
          />
        </div>
        <div className="max-w-[360px] w-full flex flex-col gap-8">
          <ProductFeaturedImages images={images} onChange={setImages} />
          <KeywordInput
            label="Keywords"
            name="keywords"
            value={keywords}
            onChange={(_, v) => setKeywords(v)}
          />
        </div>
      </div>
      <ProductInventoryTable inventory={inventory} />
    </form>
  );
};
