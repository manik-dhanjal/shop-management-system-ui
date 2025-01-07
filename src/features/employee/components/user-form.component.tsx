import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@shared/context/alert.context';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button, TextField } from '@mui/material';

interface UserFormTypes {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone?: number;
	profileImage?: File;
}

const INITIAL_FORM_VALUES: UserFormTypes = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
};

const UserForm: React.FC = () => {
	const [formValues, setFormValues] =
		useState<UserFormTypes>(INITIAL_FORM_VALUES);
	const { control, handleSubmit } = useForm<UserFormTypes>();

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

	const onSubmit: SubmitHandler<UserFormTypes> = async (data) => {};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="firstName"
					control={control}
					render={({ field }) => <TextField {...field} label="First Name" />}
				/>
				<TextField label="First Name" />
				<Button variant="contained">Submit</Button>
			</form>
		</>
	);
};

export default UserForm;
