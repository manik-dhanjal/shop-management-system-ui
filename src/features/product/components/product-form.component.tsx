import React, { useState } from 'react';
import { ProductFormType } from '@features/product/interfaces/product.interface';
import { ProductProperty } from '@features/product/interfaces/product-property.interface';
import TextBox from '@shared/components/form/text-box.component';
import TextArea from '@shared/components/form/text-area.component';
import KeywordInput from '@shared/components/form/keyword-input.component';
import TableInput from '@shared/components/form/table-input.component';
import Button from '@shared/components/form/button.component';
import ProductFeaturedImages from '@features/product/components/product-featured-images.component';
import { Image } from '@shared/interfaces/image.interface';
import NumberInput from '@shared/components/form/number-input.component';
import { omit as _omit } from 'lodash';

const INITIAL_PRODUCT_FORM: ProductFormType = {
	name: '',
	description: '',
	sku: '',
	images: [],
	hsn: '',
	brand: '',
	keywords: [],
	properties: [],
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
	const [productForm, setProductForm] =
		useState<ProductFormType>(initialFormValues);
	const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		onSubmit(productForm);
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProductForm({
			...productForm,
			[e.target.name]: e.target.value,
		});
	};
	const handleNumberChange = (name: string, value: number) => {
		setProductForm({
			...productForm,
			[name]: value,
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
		setProductForm({
			...productForm,
			[name]: value,
		});
	};
	const handleImageChange = (images: Image[]) => {
		setProductForm({
			...productForm,
			images,
		});
	};
	return (
		<div className="flex gap-10">
			<div className="flex-1">
				<h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mb-6">
					{formTitle}
				</h1>
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
					<div className="flex gap-5 mb-5 ">
						<NumberInput
							label="SGST"
							name="sgstRate"
							value={productForm.sgstRate}
							onNumberChange={handleNumberChange}
							className="flex-1"
							required
						/>
						<NumberInput
							label="CGST"
							name="cgstRate"
							value={productForm.cgstRate}
							onNumberChange={handleNumberChange}
							className="flex-1"
							required
						/>
						<NumberInput
							label="IGST"
							name="igstRate"
							value={productForm.igstRate}
							onNumberChange={handleNumberChange}
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
						header={{ name: 'Name', value: 'Value' }}
						className="mb-5"
					/>
				</form>
			</div>
			<div className="bg-slate-300 w-[1px] dark:bg-gray-800" />
			<div className="w-[330px]">
				<Button type="submit" onClick={handleSave} className="btn-lg w-full">
					Save
				</Button>

				<hr className="mb-6 mt-8 border-slate-300 dark:border-gray-800" />
				<ProductFeaturedImages
					images={productForm.images}
					onChange={handleImageChange}
				/>
			</div>
		</div>
	);
};
