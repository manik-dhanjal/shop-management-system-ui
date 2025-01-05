import { useAddShop } from '@features/shop/hooks/use-add-shop.hook';
import { ShopFormType } from '@features/shop/interface/shop-form.interface';
import Button from '@shared/components/form/button.component';
import LocationForm from '@shared/components/form/location-form.component';
import TextBox from '@shared/components/form/text-box.component';
import { useAuth } from '@shared/hooks/auth.hooks';
import { Location } from '@shared/interfaces/location.interface';
import React, { useState } from 'react';

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

const TOTAL_STEPS = 3;
const STEPS = ['Name', 'Address', 'GST'];
const ShopSetupPage = () => {
	const [shopForm, setShopForm] = useState<ShopFormType>(
		INITIAL_SHOP_FORM_VALUES
	);
	const [step, setStep] = useState<number>(1);

	const { user } = useAuth();
	const { mutate, isPending } = useAddShop();

	const handleStepIncrease = () => {
		if (step < TOTAL_STEPS) setStep(step + 1);
	};
	const handleStepDecrease = () => {
		if (step > 1) setStep(step - 1);
	};
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
		mutate(shopForm);
	};
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="border border-gray-600 rounded-lg min-w-[500px] px-10 py-8 ">
				<h2 className="text-2xl mb-12 dark:text-gray-200 text-gray-950 text-center">
					Hi {user?.firstName}, Let's setup your shop 💈
				</h2>
				<div className="mb-20 relative w-[70%] m-auto">
					<div className="bg-gray-700 h-1 w-full"></div>
					<div
						className="bg-gray-200 h-1 absolute top-[0] left-0 transition-all duration-300"
						style={{
							width: `${(step - 1) * Math.floor(100 / (STEPS.length - 1))}%`,
						}}
					></div>
					{STEPS.map((name, idx) => (
						<div
							key={name + idx}
							className="absolute top-0.5 translate-y-[-12px] translate-x-[-50%] flex flex-col items-center"
							style={{ left: `${idx * Math.floor(100 / (STEPS.length - 1))}%` }}
						>
							<div
								key={name + idx}
								className={`w-6 h-6 justify-center items-center flex rounded-full text-sm transition-colors duration-100 ${
									idx + 1 <= step
										? 'dark:bg-gray-200 dark:text-gray-950 bg-gray-900  text-gray-100'
										: 'dark:bg-gray-700 dark:text-gray-500 bg-gray-400  text-gray-600'
								}`}
							>
								{idx + 1}
							</div>
							<div
								className={`mt-2 text-sm ${
									idx + 1 <= step
										? ' dark:text-gray-200  text-gray-950'
										: ' dark:text-gray-700 text-gray-400 '
								}`}
							>
								{name}
							</div>
						</div>
					))}
				</div>
				{step === 1 && (
					<div className="flex flex-col items-center">
						<p className="text-lg mb-5">What is your shop's name ?</p>
						<TextBox
							name="name"
							label="Name"
							className="w-full"
							onChange={handleInputChange}
							value={shopForm.name}
							required
						/>
					</div>
				)}

				{step === 2 && (
					<div className="flex flex-col items-center">
						<p className="text-lg mb-5">What is your shop's address ?</p>
						<LocationForm
							onChange={handleLocationChange}
							values={shopForm.location}
							className="w-full"
						/>
					</div>
				)}

				{step === 3 && (
					<div className="flex flex-col items-center">
						<p className="text-lg mb-5">
							What is your GST Identification Number?
						</p>
						<TextBox
							name="gstin"
							label="GSTIN (Optional)"
							className="w-full"
							onChange={handleInputChange}
							value={shopForm.gstin}
						/>
					</div>
				)}
				<div className="flex justify-between w-full mt-8">
					<div>
						{step > 1 && (
							<Button onClick={handleStepDecrease} secondary>
								Prev
							</Button>
						)}
					</div>
					<div>
						{step < TOTAL_STEPS && (
							<Button onClick={handleStepIncrease} className="self-end">
								Next
							</Button>
						)}
						{step === TOTAL_STEPS && (
							<Button
								onClick={handleSave}
								className="self-end"
								disabled={isPending}
							>
								{isPending ? 'Saving...' : "Let's go"}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShopSetupPage;
