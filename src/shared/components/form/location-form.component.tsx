import { Location } from '@shared/interfaces/location.interface';
import React from 'react';
import TextBox from './text-box.component';

interface LocationFormProps {
	onChange: (location: Location) => void;
	values: Location;
	className?: string;
	title?: string;
}
const LocationForm = ({
	onChange,
	values,
	title,
	className,
}: LocationFormProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		onChange({
			...values,
			[e.target.name]: e.target.value,
		});
	};
	return (
		<div className={className}>
			{title && <h4 className="mb-3">{title}</h4>}

			<TextBox
				label="Country"
				name="country"
				value={values.country}
				onChange={handleChange}
				className="mb-5 w-full"
				required
			/>
			<TextBox
				label="State"
				name="state"
				value={values.state}
				onChange={handleChange}
				className="mb-5 w-full"
				required
			/>
			<TextBox
				label="City"
				name="city"
				value={values.city}
				onChange={handleChange}
				className="mb-5 w-full"
				required
			/>
			<TextBox
				label="Pin Code"
				name="pinCode"
				value={values.pinCode}
				onChange={handleChange}
				className="mb-5 w-full"
				required
			/>
			<TextBox
				label="Address"
				name="address"
				value={values.address}
				onChange={handleChange}
				className="w-full"
				required
			/>
		</div>
	);
};

export default LocationForm;
