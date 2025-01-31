import Button from '@shared/components/form/button.component';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
	const navigate = useNavigate();
	return (
		<div>
			<div className="min-h-screen flex flex-col justify-center items-center">
				<h1 className="dark:text-gray-100 text-gray-900 text-5xl text-center font-extralight mb-8">
					SIMPLIFY YOUR OPERATIONS, <br />
					SEAMLESSLY.
				</h1>
				<p className="max-w-[500px] text-center mb-5">
					Join an advanced platform trusted by retailers and businesses, manage
					inventory effortlessly, and streamline billing and GST filing. Empower
					your shop management with 100% compliance and efficiency.
				</p>
				<div className="flex gap-5">
					<Button onClick={() => navigate('/dashboard')}>Join us</Button>
					<Button onClick={() => navigate('/contact')} secondary>
						Contact us
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
