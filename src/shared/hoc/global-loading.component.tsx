import { CircularProgress } from '@mui/material';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalLoadingContextProps {
	showLoading: () => void;
	hideLoading: () => void;
}

const GlobalLoadingContext = createContext<
	GlobalLoadingContextProps | undefined
>(undefined);

export const useGlobalLoading = (): GlobalLoadingContextProps => {
	const context = useContext(GlobalLoadingContext);
	if (!context) {
		throw new Error(
			'useGlobalLoading must be used within a GlobalLoadingProvider'
		);
	}
	return context;
};

export const GlobalLoadingProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const showLoading = () => setIsLoading(true);
	const hideLoading = () => setIsLoading(false);

	return (
		<GlobalLoadingContext.Provider value={{ showLoading, hideLoading }}>
			{children}
			{isLoading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<CircularProgress />
				</div>
			)}
		</GlobalLoadingContext.Provider>
	);
};
