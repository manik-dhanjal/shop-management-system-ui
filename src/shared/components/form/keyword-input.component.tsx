import { ChangeEvent, useState } from 'react';
import { GoPlus } from 'react-icons/go';
import { RxCross2 } from 'react-icons/rx';

export interface KeywordInputType {
	label: string;
	value: string[];
	name: string;
	onChange: (name: string, value: string[]) => void;
	className?: string;
}
const KeywordInput = ({
	value,
	name,
	onChange,
	label,
	className,
}: KeywordInputType) => {
	const [currentValue, setCurrentValue] = useState<string>('');
	const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (currentValue) {
				onChange(name, [...value, currentValue]);
				setCurrentValue('');
			}
		}
	};
	const handleRemove = (targetItem: string, targetIndex: number) => {
		const filterValue = value.filter(
			(item, index) => targetItem !== item || index !== targetIndex
		);
		onChange(name, filterValue);
	};
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentValue(e.target.value);
	};

	return (
		<div className={`${className} max-w-full`}>
			<div className="text-slate-500 mb-3">{label}</div>
			<div className=" flex flex-wrap gap-3 max-w-full">
				{value.map((item, index) => (
					<span
						key={item + index}
						className="text-md shadow-sm dark:bg-gray-800 bg-white text-gray-700 dark:text-gray-500 rounded-lg border-transparent dark:border-gray-700/60 overflow-hidden px-5 pr-4 outline-none inline-flex justify-center items-center"
					>
						<div className="max-w-[300px] truncate py-3 pr-3 text-gray-700 dark:text-gray-300">
							{item}
						</div>
						<RxCross2
							className="text-2xl ml-1 text-gray-400 dark:text-gray-500 cursor-pointer"
							onClick={() => handleRemove(item, index)}
						/>
					</span>
				))}
				<div className="relative inline-block w-40 shadow-sm">
					<input
						type="text"
						value={currentValue}
						onChange={handleInputChange}
						onKeyDown={handleAdd}
						className={`text-md border dark:bg-gray-800 bg-white text-gray-700 dark:text-gray-300 border-transparent dark:border-gray-700/60 rounded-lg overflow-hidden px-5 py-3 outline-none inline ${
							currentValue
								? 'opacity-100 w-40 cursor-text'
								: 'w-12  opacity-0 cursor-pointer'
						} focus:w-40 peer focus:opacity-100  focus:cursor-text transition-all duration-500`}
						placeholder="Type Here ..."
					/>
					<div
						className={`dark:bg-gray-800 bg-white p-[10px] rounded-lg overflow-hidden absolute top-0 -z-10 peer-focus:opacity-0 duration-150 ${
							currentValue && 'opacity-0'
						} transition-all shadow-sm`}
					>
						<GoPlus className="text-gray-400 dark:text-gray-500 text-3xl" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default KeywordInput;
