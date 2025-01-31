import Button from '@shared/components/form/button.component';
import TextBox from '@shared/components/form/text-box.component';
import React, { useEffect, useState } from 'react';
import signupImg from '@media/images/signup.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/auth.hooks';
import { AlertSeverity, useAlert } from '@shared/context/alert.context';
import { omit } from 'lodash';

interface SignUpFormValues {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone?: number;
	profileImage?: File;
}

const INITIAL_FORM_VALUES: SignUpFormValues = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
};

const SignupPage: React.FC = () => {
	const [formValues, setFormValues] =
		useState<SignUpFormValues>(INITIAL_FORM_VALUES);

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
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			return;
		}
		setFormValues((prev) => ({
			...prev,
			profileImage: (e.target.files as FileList)[0],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const user = await auth.signup(
				omit(formValues, ['phone', 'profileImage'])
			);
			globalAlert.addAlert(
				`Keep it up ${user.firstName}, You're almost there 🍻`,
				AlertSeverity.SUCCESS
			);
			navigate('/dashboard');
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
		<>
			<div className="h-5 bg-white dark:bg-gray-900"></div>
			<div className="min-h-screen flex items-stretch justify-center bg-white dark:bg-gray-900">
				<div className="w-[50%] py-20 px-10 flex items-center justify-end">
					<div className="max-w-lg">
						<img
							src={signupImg}
							className="w-full h-full object-contain object-center"
						/>
					</div>
				</div>
				<div className="flex items-center justify-start mt-5 w-[50%] px-10">
					<div className="bg-white/60 dark:bg-gray-800/50  shadow-md rounded-lg p-8 w-full max-w-lg">
						<h2 className="text-2xl font-semibold text-center  text-gray-700 dark:text-gray-100">
							Create Your Account
						</h2>
						<p className="text-sm text-gray-500 text-center mb-6">
							Join us and start managing your shop effortlessly.
						</p>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="flex gap-5">
								{/* First Name */}
								<TextBox
									label="First Name"
									id="firstName"
									name="firstName"
									type="text"
									value={formValues.firstName}
									onChange={handleChange}
									required
									className="w-[50%]"
								/>
								{/* Last Name */}
								<TextBox
									label="Last Name"
									id="lastName"
									name="lastName"
									type="text"
									value={formValues.lastName}
									onChange={handleChange}
									required
									className="w-[50%]"
								/>
							</div>

							{/* Email */}
							<TextBox
								label="Email"
								id="email"
								name="email"
								type="email"
								value={formValues.email}
								onChange={handleChange}
								required
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
							/>
							{/* Phone (Optional) */}
							<TextBox
								label="Phone (Optional)"
								id="phone"
								name="phone"
								type="tel"
								value={formValues.phone}
								onChange={handleChange}
								className="flex-1"
							/>
							{/* Profile Image (Optional) */}
							<div>
								<label
									htmlFor="profileImage"
									className="block text-sm font-medium text-gray-700 dark:text-gray-500"
								>
									Profile Image (Optional)
								</label>
								<input
									id="profileImage"
									name="profileImage"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="mt-1 w-full p-2 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-violet-500 focus:border-violet-500"
								/>
							</div>
							{/* Submit Button */}
							<Button
								disabled={isSubmitting}
								type="submit"
								className="w-full text-md btn-lg"
							>
								{isSubmitting ? 'Creating Account...' : 'Sign Up'}
							</Button>
						</form>
						<p className="text-sm text-center text-gray-500 mt-6">
							Already have an account?
							<Link
								to="/login"
								className="text-violet-500 hover:underline ml-2"
							>
								Log in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignupPage;
