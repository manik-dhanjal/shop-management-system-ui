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
						className="text-md border border-slate-300 bg-slate-50 rounded-full overflow-hidden px-5 py-3 pr-2 outline-none focus:border-slate-500 inline-flex justify-center items-start"
					>
						<div className="max-w-[300px] truncate">{item}</div>
						<RxCross2
							className="text-2xl ml-1 text-slate-400 cursor-pointer"
							onClick={() => handleRemove(item, index)}
						/>
					</span>
				))}
				<div className="relative inline-block w-40">
					<input
						type="text"
						value={currentValue}
						onChange={handleInputChange}
						onKeyDown={handleAdd}
						className={`text-md border border-slate-500 rounded-full overflow-hidden px-5 py-3 outline-none focus:border-slate-800 inline ${
							currentValue
								? 'opacity-100 w-40 cursor-text'
								: 'w-12  opacity-0 cursor-pointer'
						} focus:w-40 peer focus:opacity-100  focus:cursor-text transition-all duration-500`}
						placeholder="Type Here ..."
					/>
					<div
						className={`bg-slate-700 p-[10px] rounded-full overflow-hidden absolute top-0 -z-10 peer-focus:opacity-0 duration-150 ${
							currentValue && 'opacity-0'
						} transition-all`}
					>
						<GoPlus className="text-slate-50 text-3xl" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default KeywordInput;
