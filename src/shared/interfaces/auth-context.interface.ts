import { Shop } from '@features/shop/interface/shop.interface';
import { User } from '@features/user/interface/user.interface';

export interface LoginRequest {
	email: string;
	password: string;
}
export interface SignupRequest
	extends Omit<User, '_id' | '__v' | 'shopsMeta' | 'isActive'> {}

export interface AuthContextType {
	user: User | null;
	activeShop: Shop<string> | null;
	setActiveShop: (shopId: string) => boolean;
	refreshUser: () => Promise<void>;
	login: (credentials: LoginRequest) => Promise<User>;
	logout: () => void;
	signup: (newUser: SignupRequest) => Promise<User>;
}

export interface AuthToken {
	token: string;
	expiresOn: number;
	expiresIn: number;
}

export interface AuthTokens {
	refresh: AuthToken;
	access: AuthToken;
}
