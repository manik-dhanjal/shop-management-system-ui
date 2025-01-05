import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '@utils/Transition';

import UserAvatar from '@shared/media/images/user-avatar-32.png';
import { useAuth } from '@shared/hooks/auth.hooks';

interface ShopSelectDropdownProps {
	align: 'right' | 'left';
}

const ShopSelectDropdown = ({ align }: ShopSelectDropdownProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { activeShop, setActiveShop, user } = useAuth();

	if (!activeShop || !user) return;

	if (user.shopsMeta.length < 2) {
		return (
			<div className="flex items-center truncate">
				<span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
					{activeShop.name}
				</span>
			</div>
		);
	}

	const trigger = useRef<HTMLButtonElement>(null);
	const dropdown = useRef<HTMLDivElement>(null);

	const handleShopSelect = (selectedShopId: string) => {
		setActiveShop(selectedShopId);
		setDropdownOpen(false);
	};

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (!dropdown.current || !trigger.current) return;
			if (
				!dropdownOpen ||
				dropdown.current.contains(target as Node) ||
				trigger.current.contains(target as Node)
			)
				return;
			setDropdownOpen(false);
		};
		document.addEventListener('click', clickHandler);
		return () => document.removeEventListener('click', clickHandler);
	});

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ code }: KeyboardEvent) => {
			if (!dropdownOpen || code !== 'Escape') return;
			setDropdownOpen(false);
		};
		document.addEventListener('keydown', keyHandler);
		return () => document.removeEventListener('keydown', keyHandler);
	});

	return (
		<div className="relative inline-flex">
			<button
				ref={trigger}
				className="inline-flex justify-center items-center group"
				aria-haspopup="true"
				onClick={() => setDropdownOpen(!dropdownOpen)}
				aria-expanded={dropdownOpen}
			>
				<div className="flex items-center truncate">
					<span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
						{activeShop.name}
					</span>

					<svg
						className="w-3 h-3 shrink-0 ml-2 fill-current text-gray-400 dark:text-gray-500 "
						viewBox="0 0 12 12"
					>
						<path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
					</svg>
				</div>
			</button>

			<Transition
				className={`origin-top-right z-10 absolute top-full min-w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
					align === 'right' ? 'right-0' : 'left-0'
				}`}
				show={dropdownOpen}
				enter="transition ease-out duration-200 transform"
				enterStart="opacity-0 -translate-y-2"
				enterEnd="opacity-100 translate-y-0"
				leave="transition ease-out duration-200"
				leaveStart="opacity-100"
				leaveEnd="opacity-0"
				appear={undefined}
			>
				<div
					ref={dropdown}
					onFocus={() => setDropdownOpen(true)}
					onBlur={() => setDropdownOpen(false)}
				>
					<div className="px-4 py-1">Select your shop</div>
					<hr className="dark:border-gray-600 my-2.5" />
					<ul className=" px-4 py-2">
						{user.shopsMeta.map((shopMeta, idx) => (
							<>
								<button
									onClick={() => handleShopSelect(shopMeta.shop._id)}
									className={` w-full text-left dark:text-gray-300 text-gray-600' ${
										idx !== 0 && 'mt-3'
									} hover:text-violet-600 hover:dark:text-violet-600`}
								>
									{shopMeta.shop.name}
								</button>
							</>
						))}
					</ul>
				</div>
			</Transition>
		</div>
	);
};

export default ShopSelectDropdown;
