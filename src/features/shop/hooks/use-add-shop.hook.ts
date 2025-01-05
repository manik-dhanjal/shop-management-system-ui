import { useAuth } from '@shared/hooks/auth.hooks';
import { useNavigate } from 'react-router-dom';
import { ShopFormType } from '../interface/shop-form.interface';
import { useMutation } from '@tanstack/react-query';
import { ShopApi } from '@shared/api/shop.api';
import { AlertSeverity, useAlert } from '@shared/context/alert.context';
import { AxiosError } from 'axios';

export const useAddShop = () => {
	const { setActiveShop, refreshUser } = useAuth();
	const navigate = useNavigate();
	const alert = useAlert();
	return useMutation({
		mutationFn: (newShop: ShopFormType) => {
			return ShopApi.addShop(newShop);
		},
		onSuccess: async (addedShop) => {
			await refreshUser();
			setActiveShop(addedShop._id);
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				alert.addAlert(error.response?.data.message, AlertSeverity.ERROR);
			} else {
				alert.addAlert('Unable to add shop', AlertSeverity.ERROR);
			}
		},
	});
};
