import React, { useState } from "react";
import { AddProduct as AddProductType } from "./interfaces/add-product.interface";
import { ProductProperty } from "./interfaces/product-property.interface";
import TextBox from "@components/text-box.component";
import TextArea from "@components/text-area.component";
import KeywordInput from "@components/keyword-input.component";
import TableInput from "@components/table-input.component";
import Button from "@components/button.component";
import ProductImages from "@partials/products/product-images.component";
const INITIAL_PRODUCT_FORM: AddProductType = {
  name: "",
  description: "",
  sku: "",
  images: [],
  hsn: "",
  brand: "",
  keywords: [],
  properties: [],
  igstRate: 0, //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
  cgstRate: 0, //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
  sgstRate: 0, //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
};

const AddProduct = () => {
  const [productForm, setProductForm] =
    useState<AddProductType>(INITIAL_PRODUCT_FORM);

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("form submited", productForm);
  };
  const handleSaveDraft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("form draft submited", productForm);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleKeywordChange = (name: string, value: string[]) => {
    setProductForm({
      ...productForm,
      [name]: value,
    });
  };
  const handleTableChange = (name: string, value: ProductProperty[]) => {
    console.log(name, value);
    setProductForm({
      ...productForm,
      [name]: value,
    });
  };
  return (
    <div className="flex gap-10">
      <div className="flex-1">
        <h2 className="text-2xl mb-6">Add New Product</h2>
        <form className="">
          <TextBox
            label="Product Name"
            name="name"
            value={productForm.name}
            onChange={handleInputChange}
            className="mb-5"
            required
          />
          <TextArea
            label="Description"
            name="description"
            className="mb-5"
            value={productForm.description}
            onChange={handleTextAreaChange}
          />
          <TextBox
            label="Brand Name"
            name="brand"
            value={productForm.brand}
            onChange={handleInputChange}
            className="mb-5"
            required
          />
          <div className="flex gap-5 mb-5 ">
            <TextBox
              label="SKU"
              name="sku"
              value={productForm.sku}
              onChange={handleInputChange}
              className="flex-1"
              required
            />
            <TextBox
              label="HSN Code"
              name="hsn"
              value={productForm.hsn}
              onChange={handleInputChange}
              className="flex-1"
              required
            />
          </div>
          <KeywordInput
            label="Keywords"
            name="keywords"
            value={productForm.keywords}
            onChange={handleKeywordChange}
            className="mb-5"
          />
          <TableInput
            name="properties"
            onChange={handleTableChange}
            value={productForm.properties}
            label="Properties"
            header={{ name: "Name", value: "Value" }}
            className="mb-5"
          />
        </form>
      </div>
      <div className="bg-slate-300 w-[1px]" />
      <div className="w-[330px]">
        <div>
          <h2 className="text-xl text-gray-600 mb-3">Publish Product</h2>
          <p>
            <strong>Created At:</strong> {new Date().toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong> {new Date().toLocaleString()}
          </p>
          <div className="flex w-full gap-5 mt-5">
            <Button
              type="submit"
              onClick={handleSave}
              secondary
              className="btn-lg"
            >
              Save Draft
            </Button>
            <Button type="submit" onClick={handleSaveDraft} className="btn-lg">
              Save
            </Button>
          </div>
        </div>

        <hr className="mb-6 mt-8 border-slate-300" />
        <ProductImages images={productForm.images} />
        {/* Images */}
        <div></div>
      </div>
    </div>
  );
};

export default AddProduct;
