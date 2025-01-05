import Button from '@shared/components/form/button.component';
import ThemeToggle from '@shared/components/ThemeToggle';
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const IntroductionLayout = () => {
	const [newsLetterMail, setNewsLetterMail] = useState<string>('');
	const navigate = useNavigate();

	const handleNewsLetterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setNewsLetterMail(e.target.value);
	};
	const sendNewsLetterMail = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		console.log(newsLetterMail);
	};
	return (
		<>
			<header className="fixed top-0 left-0 right-0 dark:bg-gray-900 bg-gray-100 z-60">
				<div className="flex justify-between items-center w-full px-10 py-3">
					<div className="w-48">
						<Link to="/">
							<div>LOGO</div>
						</Link>
					</div>

					<menu>
						<ul className="flex gap-16 items-center justify-center">
							<li>
								<Link
									to="/"
									className="hover:dark:text-gray-200 hover:text-gray-950 text-gray-500 dark:text-gray-400/80 transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/services"
									className="hover:dark:text-gray-200 hover:text-gray-950 text-gray-500 dark:text-gray-400/80 transition-colors"
								>
									Services
								</Link>
							</li>
							<li>
								<Link
									to="/pricing"
									className="hover:dark:text-gray-200 hover:text-gray-950 text-gray-500 dark:text-gray-400/80 transition-colors"
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="hover:dark:text-gray-200 hover:text-gray-950 text-gray-500/80 dark:text-gray-400/80 transition-colors"
								>
									Contact
								</Link>
							</li>
						</ul>
					</menu>

					<div className="w-48 flex justify-end gap-4 items-center">
						<ThemeToggle />
						<Button onClick={() => navigate('/dashboard')}>
							Go to Dashboard
						</Button>
					</div>
				</div>
				<hr className="border-gray-200 dark:border-gray-800 w-full" />
			</header>
			<main>{<Outlet />}</main>
			<hr className="border-gray-200 dark:border-gray-800 w-full" />
			<footer className="h-[200px]">
				<div className="py-10 pb-8 px-10">
					<div className="text-2xl mb-5 dark:text-gray-500 text-gray-800 text-center">
						Subscribe for Updates
					</div>
					<div className="flex items-center gap-5 w-full justify-center">
						<input
							name="email"
							value={newsLetterMail}
							onChange={handleNewsLetterInput}
							placeholder="Enter your Email..."
							type="email"
							className="dark:bg-gray-800 bg-gray-200 border-none outline-none rounded-lg text-sm w-[300px]"
						></input>
						<Button onClick={sendNewsLetterMail}>Subscribe</Button>
					</div>
				</div>

				{/* <hr className="border-gray-200 dark:border-gray-800 w-full " /> */}
				<div className="flex w-full justify-between  px-10 pb-2 text-sm dark:text-gray-600 text-gray-500">
					<div>Copyright © 2025</div>
					<div>
						Design and Develped by{' '}
						<Link to="https://manikdhanjal.com" className="underline">
							Manik Dhanjal
						</Link>
					</div>
				</div>
			</footer>
		</>
	);
};

export default IntroductionLayout;
