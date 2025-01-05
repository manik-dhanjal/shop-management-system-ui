import Button from '@shared/components/form/button.component';
import TextBox from '@shared/components/form/text-box.component';
import React, { useEffect, useState } from 'react';
import loginImg from '@media/images/login.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/auth.hooks';
import { AlertSeverity, useAlert } from '@shared/context/alert.context';

interface LoginFormValues {
	email: string;
	password: string;
}

const LoginPage: React.FC = () => {
	const [formValues, setFormValues] = useState<LoginFormValues>({
		email: '',
		password: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const auth = useAuth();
	const globalAlert = useAlert();
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const user = await auth.login(formValues);
			globalAlert.addAlert(
				`Welcome back ${user.firstName} 🙏`,
				AlertSeverity.SUCCESS
			);
			navigate('/dashboard/analytics');
		} catch (error) {
			globalAlert.addAlert((error as Error).message, AlertSeverity.ERROR);
		}

		setIsSubmitting(false);
	};

	useEffect(() => {
		if (auth.user) {
			navigate('/dashboard/analytics');
		}
	}, [auth.user]);
	return (
		<div className="min-h-screen flex items-stretch justify-center bg-white dark:bg-gray-900">
			<div className="w-[50%] py-20 px-10 flex items-center justify-end">
				<div className="max-w-lg">
					<img
						src={loginImg}
						className="w-full h-full object-contain object-center"
					/>
				</div>
			</div>
			<div className="w-[50%] flex  items-center justify-start px-10">
				<div className="bg-gray-50 dark:bg-gray-800/50 shadow-md rounded-lg w-full max-w-lg px-8 py-12 border-gray-50">
					<h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-100">
						Login to Your Account
					</h2>
					<p className="text-sm text-gray-500  text-center mb-8">
						Welcome back! Please enter your details.
					</p>
					<form onSubmit={handleSubmit}>
						{/* Email */}
						<TextBox
							label="Email"
							id="email"
							name="email"
							type="email"
							value={formValues.email}
							onChange={handleChange}
							required
							className="mb-5"
						/>
						{/* Password */}
						<TextBox
							label="Password"
							id="password"
							name="password"
							type="password"
							value={formValues.password}
							onChange={handleChange}
							required
							className="mb-9"
						/>
						{/* Submit Button */}
						<Button
							disabled={isSubmitting}
							type="submit"
							className="w-full text-md btn-lg "
						>
							{isSubmitting ? 'Logging in...' : 'Login'}
						</Button>
					</form>
					<p className="text-sm text-center text-gray-500 mt-9">
						Don’t have an account?
						<Link to="/signup" className="text-violet-500 hover:underline ml-2">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
