import React from 'react';

export interface TextBoxType
	extends React.AllHTMLAttributes<HTMLInputElement> {}

const TextBox = ({ label, value, className, ...otherProps }: TextBoxType) => {
	return (
		<div className={`relative ${className}`}>
			<input
				className="text-md border border-slate-300 rounded-full overflow-hidden px-5 py-3 w-full outline-none focus:border-slate-500 peer"
				id={otherProps.name}
				value={value}
				{...otherProps}
				type="text"
			/>
			{label && (
				<label
					id={otherProps.name}
					className={`bg-white absolute left-4 px-2 translate-y-[-50%] transition-all text-slate-500 peer-focus:top-0 peer-focus:text-sm ${
						value ? 'top-0  text-sm' : ' top-[50%] text-md'
					}`}
				>
					{label}
					{otherProps.required && <span className="text-red-700 ml-1">*</span>}
				</label>
			)}
		</div>
	);
};

export default TextBox;
