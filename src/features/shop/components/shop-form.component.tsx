import React, { useState } from 'react';
import { ShopFormType } from '../interface/shop-form.interface';
import TextBox from '@shared/components/form/text-box.component';
import Button from '@shared/components/form/button.component';
import LocationForm from '@shared/components/form/location-form.component';
import { Location } from '@shared/interfaces/location.interface';

interface ShopFormProps {
	formTitle: string;
	onSubmit: (shop: ShopFormType) => void;
	initialFormValues?: ShopFormType;
}
const INITIAL_SHOP_FORM_VALUES: ShopFormType = {
	name: '',
	location: {
		address: '',
		country: '',
		state: '',
		city: '',
		pinCode: '',
	},
	gstin: '',
	suppliers: [],
};
const ShopForm = ({
	formTitle,
	onSubmit,
	initialFormValues = INITIAL_SHOP_FORM_VALUES,
}: ShopFormProps) => {
	const [shopForm, setShopForm] = useState<ShopFormType>(initialFormValues);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShopForm({
			...shopForm,
			[e.target.name]: e.target.value,
		});
	};
	const handleLocationChange = (location: Location) => {
		setShopForm({
			...shopForm,
			location,
		});
	};
	const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		onSubmit(shopForm);
	};
	return (
		<div>
			<div className="flex gap-10">
				<div className="flex-1">
					<h2 className="text-2xl mb-6">{formTitle}</h2>
					<form className="">
						<TextBox
							label="Shop Name"
							name="name"
							value={shopForm.name}
							onChange={handleInputChange}
							className="mb-5 max-w-[400px]"
							required
						/>
						<TextBox
							label="GSTIN (Optional)"
							name="gstin"
							value={shopForm.gstin}
							onChange={handleInputChange}
							className="mb-5 max-w-[400px]"
						/>
						<LocationForm
							onChange={handleLocationChange}
							values={shopForm.location}
							title="Shop Address"
							className="mb-8 max-w-[400px]"
						/>
						<Button type="submit" onClick={handleSave} className="btn-lg">
							Save
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ShopForm;
