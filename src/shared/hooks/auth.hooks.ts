import { Shop } from '@features/shop/interface/shop.interface';
import { AuthContext } from '@shared/context/auth.context';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
