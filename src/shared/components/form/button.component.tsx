import React from 'react';

interface ButtonType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	secondary?: boolean;
}

const Button = ({
	children,
	className,
	secondary = false,
	disabled = false,
	...otherProps
}: ButtonType) => {
	return (
		<button
			disabled={disabled}
			className={`btn ${
				disabled
					? secondary
						? 'border-gray-200 dark:text-gray-700 dark:border-gray-700 text-gray-400'
						: 'bg-gray-200 text-gray-500 dark:bg-gray-800/60 dark:text-gray-700'
					: secondary
					? 'border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-300 hover:border-gray-900 dark:border-gray-300  hover:dark:border-white'
					: 'bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white'
			} ${className}`}
			{...otherProps}
		>
			{children}
		</button>
	);
};

export default Button;
