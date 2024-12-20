import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
export interface PaginationType {
	totalPages: number;
	activePage: number;
	onChange: (page: number) => void;
	maxPageToShow?: number;
	className?: string;
}
export const Pagination = ({
	totalPages,
	activePage,
	onChange,
	maxPageToShow = 5,
	className = '',
}: PaginationType) => {
	const next = () => {
		if (activePage >= totalPages) return;
		onChange(activePage + 1);
	};

	const prev = () => {
		if (activePage <= 1) return;
		onChange(activePage - 1);
	};

	const handleClick = (clickedPageNum: number) => {
		if (clickedPageNum === activePage) return;
		onChange(clickedPageNum);
	};

	const calculatePagesToShow = (): number[] => {
		const halfOfMaxPageToShow = Math.floor(maxPageToShow / 2);
		const pagesToShowBeforeActivePage =
			activePage + halfOfMaxPageToShow > totalPages
				? Math.max(totalPages - maxPageToShow + 1, 1)
				: Math.max(activePage - halfOfMaxPageToShow, 1);

		const pagesArr = [...Array(Math.min(totalPages, maxPageToShow)).keys()];
		return pagesArr.map((page) => page + pagesToShowBeforeActivePage);
	};
	const pagesToShow = calculatePagesToShow();

	const handleLeftDotsClick = () => {
		if (pagesToShow.length === 0) return;
		const middleIndex = Math.floor(pagesToShow[0] / 2);
		onChange(1 + middleIndex);
	};

	const handleRightDotsClick = () => {
		if (pagesToShow.length === 0) return;
		if (totalPages <= pagesToShow[pagesToShow.length - 1]) return;
		const middleIndex = Math.floor(
			(totalPages - pagesToShow[pagesToShow.length - 1]) / 2
		);
		onChange(pagesToShow[pagesToShow.length - 1] + middleIndex);
	};

	return (
		<div
			className={`flex items-center gap-4 w-full justify-center ${className}`}
		>
			<button
				className={`flex items-center gap-2 ${
					activePage === 1 && 'text-gray-300 dark:text-gray-700'
				}`}
				onClick={prev}
				disabled={activePage === 1}
			>
				<IoChevronBack strokeWidth={2} className="h-4 w-4" /> Previous
			</button>
			<div className="flex items-center gap-1">
				{pagesToShow[0] !== 1 && (
					<>
						<PgBtn
							index={1}
							activePage={activePage}
							handleClick={handleClick}
						/>
					</>
				)}
				{pagesToShow[0] !== 1 && pagesToShow[0] !== 2 && (
					<button onClick={handleLeftDotsClick}>...</button>
				)}
				{pagesToShow.map((index) => (
					<PgBtn
						index={index}
						activePage={activePage}
						handleClick={handleClick}
					/>
				))}
				{pagesToShow[pagesToShow.length - 1] !== totalPages &&
					pagesToShow[pagesToShow.length - 1] + 1 !== totalPages && (
						<button onClick={handleRightDotsClick}>...</button>
					)}
				{pagesToShow[pagesToShow.length - 1] !== totalPages && (
					<PgBtn
						index={totalPages}
						activePage={activePage}
						handleClick={handleClick}
					/>
				)}
			</div>
			<button
				className={`flex items-center gap-2 ${
					activePage === totalPages && 'text-gray-300 dark:text-gray-700'
				}`}
				onClick={next}
				disabled={activePage === totalPages}
			>
				Next
				<IoChevronForward strokeWidth={2} className="h-4 w-4" />
			</button>
		</div>
	);
};

const PgBtn = ({
	index,
	activePage,
	handleClick,
}: {
	index: number;
	activePage: number;
	handleClick: (a: number) => void;
}) => {
	return (
		<button
			onClick={() => handleClick(index)}
			key={'pag-btn' + index}
			className={` w-8 h-8 flex justify-center items-center transition rounded-lg ${
				index === activePage && 'bg-violet-400 text-white '
			}`}
		>
			{index}
		</button>
	);
};
