import React, { useEffect, useState } from 'react';

export interface NumberBoxType
	extends React.AllHTMLAttributes<HTMLInputElement> {
	onNumberChange: (a: string, b: number) => void;
}

const NumberBox = ({
	label,
	value,
	className,
	type = 'text',
	onNumberChange,
	...otherProps
}: NumberBoxType) => {
	const [error, setError] = useState('');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!onNumberChange) return;
		const inputValue = e.target.value;
		// Regular expression to allow only numbers and decimals
		const isValid = /^\d*\.?\d*$/.test(inputValue);

		if (isValid || inputValue === '') {
			onNumberChange(e.target.name, Number(inputValue));
			setError('');
		} else {
			setError('Enter number only.');
		}
	};
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
			return () => clearTimeout(timer); // Cleanup the timer
		}
	}, [error]);
	return (
		<div className={`relative ${className}`}>
			<input
				className="text-m dark:bg-gray-800 border border-transparent dark:border-gray-700/60 rounded-lg overflow-hidden px-5 pt-6 w-full outline-none focus:border-slate-500 peer shadow-sm"
				id={otherProps.name}
				value={value}
				{...otherProps}
				type={type}
				onChange={handleChange}
			/>
			{label && (
				<label
					id={otherProps.name}
					className={`absolute left-3 px-2 translate-y-[-50%] transition-all text-gray-400 dark:text-gray-500 peer-focus:top-[15px]  peer-focus:text-xs ${
						typeof value === 'number'
							? 'top-[15px]  text-xs'
							: ' top-[50%] text-md'
					}`}
				>
					{label}
					{otherProps.required && <span className="text-red-700 ml-1">*</span>}
				</label>
			)}
			{error && (
				<span className="absolute bottom-[-25px] left-0 text-sm">{error}</span>
			)}
		</div>
	);
};

export default NumberBox;
