import { createContext, useState, ReactNode } from 'react';

import { User } from '@features/user/interface/user.interface';
import {
	AuthContextType,
	LoginRequest,
	SignupRequest,
} from '@shared/interfaces/auth-context.interface';
import { AuthApi } from '@shared/api/auth.api';
import { AxiosError } from 'axios';
import { Shop } from '@features/shop/interface/shop.interface';

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [activeShop, setActiveShop] = useState<Shop<string> | null>(null);

	const login = async (credentials: LoginRequest): Promise<User> => {
		try {
			const { access, refresh } = await AuthApi.loginUser(credentials);
			localStorage.setItem('accessToken', access.token);
			localStorage.setItem('refreshToken', refresh.token);
			const userProfile = await AuthApi.getCurrentUser();
			console.log(userProfile);
			setUser(userProfile);
			if (userProfile.shopsMeta && userProfile.shopsMeta.length > 0) {
				const doesAlreadyExist = userProfile.shopsMeta.find(
					(shopMeta) => shopMeta.shop._id === activeShop?._id
				);
				if (!doesAlreadyExist) {
					setActiveShop(userProfile.shopsMeta[0].shop);
				}
			}
			return userProfile;
		} catch (error) {
			if (error instanceof AxiosError)
				throw new Error(error.response?.data.message);
			throw error;
		}
	};

	const logout = () => {
		setUser(null);
		setActiveShop(null);
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	};
	const signup = async (newUser: SignupRequest) => {
		try {
			const { access, refresh } = await AuthApi.registerUser(newUser);
			localStorage.setItem('accessToken', access.token);
			localStorage.setItem('refreshToken', refresh.token);
			const userProfile = await AuthApi.getCurrentUser();
			setUser(userProfile);
			if (userProfile.shopsMeta && userProfile.shopsMeta.length > 0) {
				const doesAlreadyExist = userProfile.shopsMeta.find(
					(shopMeta) => shopMeta.shop._id === activeShop?._id
				);
				if (!doesAlreadyExist) {
					setActiveShop(userProfile.shopsMeta[0].shop);
				}
			}
			return userProfile;
		} catch (error) {
			if (error instanceof AxiosError)
				throw new Error(error.response?.data.message);
			throw error;
		}
	};

	const getUser = async () => {
		try {
			const userProfile = await AuthApi.getCurrentUser();
			setUser(userProfile);
			if (userProfile.shopsMeta && userProfile.shopsMeta.length > 0) {
				const doesAlreadyExist = userProfile.shopsMeta.find(
					(shopMeta) => shopMeta.shop._id === activeShop?._id
				);
				if (!doesAlreadyExist) {
					setActiveShop(userProfile.shopsMeta[0].shop);
				}
			}
		} catch (error) {
			logout();
			if (error instanceof AxiosError)
				throw new Error(error.response?.data.message);
			throw error;
		}
	};

	const handleSetActiveShop = (shopId: string): boolean => {
		if (!user) return false;
		if (!user.shopsMeta || user.shopsMeta.length === 0) return false;
		const userHasAccessToShop = user.shopsMeta.find(
			(shopMeta) => shopMeta.shop._id === shopId
		);
		if (userHasAccessToShop) {
			setActiveShop(userHasAccessToShop.shop);
			return true;
		}
		return false;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				activeShop,
				setActiveShop: handleSetActiveShop,
				refreshUser: getUser,
				login,
				signup,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
