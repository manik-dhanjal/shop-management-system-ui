import React, { useEffect, useState } from 'react';
import {
	AddProduct as AddProductType,
	Product as ProductType,
} from './interfaces/product.interface';
import { ProductProperty } from './interfaces/product-property.interface';
import TextBox from '@components/text-box.component';
import TextArea from '@components/text-area.component';
import KeywordInput from '@components/keyword-input.component';
import TableInput from '@components/table-input.component';
import Button from '@components/button.component';
import ProductFeaturedImages from '@partials/products/product-featured-images.component';
import { Image } from '@shared/interfaces/image.interface';
import NumberInput from '@shared/components/number-input.component';
import {
	createProduct,
	getProduct,
	updateProduct,
} from '@shared/clients/product.client';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { omit as _omit } from 'lodash';
import { useGlobalLoading } from '@shared/hoc/global-loading.component';
import { AlertSeverity, useAlert } from '@shared/hoc/alert.component';

const INITIAL_PRODUCT_FORM: AddProductType = {
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

export interface AddEditProductProps {
	isEditing: boolean;
}

const AddEditProduct = ({ isEditing }: AddEditProductProps) => {
	const [productForm, setProductForm] =
		useState<AddProductType>(INITIAL_PRODUCT_FORM);
	const { productId } = useParams();
	const { showLoading, hideLoading } = useGlobalLoading();
	const navigate = useNavigate();
	const { addAlert } = useAlert();

	const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		showLoading();
		try {
			if (isEditing) {
				if (productId) {
					const updatedProduct = await updateProduct(productId, productForm);
					addAlert(
						`${updatedProduct.name} product is successfully updated.`,
						AlertSeverity.SUCCESS
					);
				} else {
					throw new Error('Product ID is not availabe');
				}
			} else {
				const addedProduct = await createProduct(productForm);
				addAlert(
					`${addedProduct.name} product is successfully added.`,
					AlertSeverity.SUCCESS
				);
			}

			setProductForm(INITIAL_PRODUCT_FORM);
			navigate('/product/all');
		} catch (error) {
			if (error instanceof AxiosError) {
				addAlert(error.response?.data?.message, AlertSeverity.ERROR);
			} else if (error instanceof Error) {
				addAlert(error.message, AlertSeverity.ERROR);
			} else {
				addAlert(
					'Unknown error occured while adding product',
					AlertSeverity.ERROR
				);
			}
		}
		hideLoading();
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

	const getProductForEditing = async () => {
		if (!productId) return;
		showLoading();
		try {
			const product = await getProduct(productId);
			setProductForm(_omit(product, ['__v', '_id']));
		} catch (error) {
			if (error instanceof AxiosError) {
				addAlert(error.response?.data?.message, AlertSeverity.ERROR);
			} else if (error instanceof Error) {
				addAlert(error.message, AlertSeverity.ERROR);
			} else {
				addAlert(
					'Unknown error occured while fetching product',
					AlertSeverity.ERROR
				);
			}
		}
		hideLoading();
	};

	useEffect(() => {
		if (isEditing) {
			getProductForEditing();
		} else {
			setProductForm(INITIAL_PRODUCT_FORM);
		}
	}, []);
	return (
		<div className="flex gap-10">
			<div className="flex-1">
				<h2 className="text-2xl mb-6">
					{isEditing ? 'Update Product' : 'Add New Product'}
				</h2>
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
				<div>
					<div className="flex w-full gap-5 mb-5">
						<Button
							type="submit"
							onClick={handleSave}
							className="btn-lg w-full"
						>
							Save
						</Button>
					</div>
					{productForm.createdAt && (
						<p className="mb-1">
							<strong>Created At:</strong>{' '}
							{new Date(productForm.createdAt).toLocaleString()}
						</p>
					)}

					{productForm.updatedAt && (
						<p>
							<strong>Updated At:</strong>{' '}
							{new Date(productForm.updatedAt).toLocaleString()}
						</p>
					)}
				</div>

				<hr className="mb-6 mt-8 border-slate-300 dark:border-gray-800" />
				<ProductFeaturedImages
					images={productForm.images}
					onChange={handleImageChange}
				/>
			</div>
		</div>
	);
};

export default AddEditProduct;
