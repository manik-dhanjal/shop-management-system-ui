import React from 'react';

export interface TextAreaType
	extends React.AllHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = ({ label, value, className, ...otherProps }: TextAreaType) => {
	return (
		<div className={`relative mt-3 ${className}`}>
			<textarea
				className="text-md border border-slate-300 rounded-3xl overflow-hidden px-5 py-3 w-full outline-none focus:border-slate-500 peer  h-[150px]"
				id={otherProps.name}
				value={value}
				{...otherProps}
			/>
			{label && (
				<label
					id={otherProps.name}
					className={`bg-white absolute left-4 px-2 translate-y-[-50%] transition-all text-slate-500 peer-focus:top-0 peer-focus:text-sm ${
						value ? 'top-0  text-sm' : ' top-6 text-md'
					}`}
				>
					{label}
					{otherProps.required && <span className="text-red-700 ml-1">*</span>}
				</label>
			)}
		</div>
	);
};

export default TextArea;
