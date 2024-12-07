import React, { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { BsTrash3 } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

export interface TableRecordType {
	name: string;
	value: string;
}
export interface TableInputType {
	label: string;
	value: TableRecordType[];
	name: string;
	header: TableRecordType;
	onChange: (name: string, value: TableRecordType[]) => void;
	className?: string;
}
const INITIAL_INPUT_PAIR: TableRecordType = {
	name: '',
	value: '',
};
const TableInput = ({
	label,
	value,
	name,
	onChange,
	header,
	className,
}: TableInputType) => {
	const [inputPair, setInputPair] = useState<TableRecordType | null>(
		INITIAL_INPUT_PAIR
	);
	const [editing, setEditing] = useState<number | null>(null);

	const handleAddField = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setInputPair(INITIAL_INPUT_PAIR);
		setEditing(null);
	};
	const closeInput = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!value || value.length === 0) return;
		setInputPair(null);
		setEditing(null);
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputPair({
			...(inputPair || INITIAL_INPUT_PAIR),
			[e.target.name]: e.target.value,
		});
	};
	const handleAddNewRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		//TODO: show messages over rejection
		if (!inputPair) return;
		if (!inputPair.name || !inputPair.value) return;
		const updatedValue = [...value, inputPair];
		onChange(name, updatedValue);
		setInputPair(null);
	};
	const handleEditingRequest = (
		e: React.MouseEvent<HTMLButtonElement>,
		index: number
	) => {
		e.preventDefault();
		setEditing(index);
		setInputPair({ ...value[index] });
	};
	const handleItemPairUpdate = (
		e: React.MouseEvent<HTMLButtonElement>,
		index: number
	) => {
		e.preventDefault();
		//TODO: show messages over rejection
		if (!inputPair) return;
		if (!inputPair.name || !inputPair.value) return;
		const firstHalfOfValue = value.splice(0, index);
		const secondHalfOfValue = value.splice(index, value.length);
		const udpatedValue = [...firstHalfOfValue, inputPair, ...secondHalfOfValue];
		onChange(name, udpatedValue);
		setEditing(null);
		setInputPair(null);
	};
	const handleItemPairDelete = (
		e: React.MouseEvent<HTMLButtonElement>,
		itemIndex: number
	) => {
		e.preventDefault();
		const updatedValue = value.filter((item, index) => index !== itemIndex);
		onChange(name, updatedValue);
	};
	return (
		<div className={`${className} w-full`}>
			<div className="text-slate-500 mb-3">{label}</div>
			<div className="">
				<div className="flex w-full border border-slate-200 rounded-t-2xl">
					<div className="flex-1 py-3 px-4 font-bold">{header.name}</div>
					<div className="flex-1 py-3 px-4 border-slate-200 border-l font-bold">
						{header.value}
					</div>
					<div className="w-16 border-l border-slate-200 flex justify-center items-center font-bold">
						{/* Edit */}
					</div>
					<div className="w-16 border-l border-slate-200 flex justify-center items-center font-bold">
						{/* Delete */}
					</div>
				</div>
				{value.map((item, index) =>
					editing === index ? (
						<div
							className="flex w-full border border-slate-400"
							key={item.name + index}
						>
							<input
								className="flex-1 py-3 px-4 outline-none"
								value={inputPair?.name}
								name="name"
								placeholder="Enter Property Name.."
								onChange={handleInputChange}
							/>
							<input
								name="value"
								className="flex-1 py-3 px-4 border-slate-200 border-l outline-none"
								placeholder={`Enter Property ${header.value}...`}
								onChange={handleInputChange}
								value={inputPair?.value}
							></input>
							<button
								className="w-16 border-l border-slate-200 flex justify-center items-center"
								onClick={closeInput}
							>
								<IoClose className="text-3xl text-red-700" />
							</button>
							<button
								className="w-16 border-l border-slate-200 flex justify-center items-center"
								onClick={(e) => handleItemPairUpdate(e, index)}
							>
								<FaCheck
									className={`text-2xl ${
										isRecordPairEmpty(inputPair)
											? 'text-gray-500'
											: 'text-green-700'
									}`}
								/>
							</button>
						</div>
					) : (
						<div className="flex w-full border-x  border-b border-slate-200">
							<div className="flex-1 py-3 px-4 outline-none">{item.name}</div>
							<div className="flex-1 py-3 px-4 border-slate-200 border-l outline-none">
								{item.value}
							</div>
							<button
								className="w-16 border-l border-slate-200 flex justify-center items-center"
								onClick={(e) => handleEditingRequest(e, index)}
							>
								<FiEdit3 className="text-3xl" />
							</button>
							<button
								className="w-16 border-l border-slate-200 flex justify-center items-center"
								onClick={(e) => handleItemPairDelete(e, index)}
							>
								<BsTrash3 className="text-2xl" />
							</button>
						</div>
					)
				)}

				{editing === null && inputPair !== null && (
					<div className="flex w-full border border-slate-400">
						<input
							className="flex-1 py-3 px-4 outline-none"
							name="name"
							placeholder={`Enter ${header.name} Here...`}
							onChange={handleInputChange}
							value={inputPair.name}
						></input>
						<input
							className="flex-1 py-3 px-4 border-slate-200 border-l outline-none"
							name="value"
							placeholder={`Enter ${header.value} Here...`}
							onChange={handleInputChange}
							value={inputPair.value}
						></input>
						<button
							className="w-16 border-l border-slate-200 flex justify-center items-center"
							onClick={closeInput}
						>
							<IoClose
								className={`text-3xl ${
									value.length === 0 ? 'text-gray-500' : 'text-red-700'
								}`}
							/>
						</button>
						<button
							className="w-16 border-l border-slate-200 flex justify-center items-center"
							onClick={handleAddNewRecord}
						>
							<FaCheck
								className={`text-2xl ${
									isRecordPairEmpty(inputPair)
										? 'text-gray-500'
										: 'text-green-700'
								}`}
							/>
						</button>
					</div>
				)}

				<button
					className="bg-slate-700 px-10 py-4 text-slate-50 w-full text-center rounded-b-2xl"
					onClick={handleAddField}
				>
					Add New Property
				</button>
			</div>
		</div>
	);
};

const isRecordPairEmpty = (inputPair: TableRecordType | null): boolean => {
	if (!inputPair) return true;
	if (!inputPair.name || inputPair.name === '') return true;
	if (!inputPair.value || inputPair.value === '') return true;
	console.log('cdc');
	return false;
};
export default TableInput;
