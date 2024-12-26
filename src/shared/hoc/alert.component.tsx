import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert as MuiAlert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

export enum AlertSeverity {
	SUCCESS = 'success',
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
}

type Alert = {
	id: string;
	message: string;
	severity: AlertSeverity;
};

type AlertContextType = {
	addAlert: (message: string, severity: AlertSeverity) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertProviderProps = {
	children: ReactNode;
};

const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
	const [alerts, setAlerts] = useState<Alert[]>([]);

	const addAlert = (message: string, severity: AlertSeverity) => {
		const id = uuidv4(); // Unique ID for each alert
		setAlerts((prev) => [...prev, { id, message, severity }]);
		setTimeout(() => removeAlert(id), 8000); // Auto-remove after 5 seconds
	};

	const removeAlert = (id: string) => {
		setAlerts((prev) => prev.filter((alert) => alert.id !== id));
	};

	return (
		<AlertContext.Provider value={{ addAlert }}>
			{children}
			<div className="fixed top-4 left-[50%] translate-x-[-50%] space-y-4 z-50">
				{alerts.map((alert) => (
					<MuiAlert
						key={alert.id}
						severity={alert.severity}
						onClose={() => removeAlert(alert.id)}
						className="cursor-pointer"
					>
						{alert.message}
					</MuiAlert>
				))}
			</div>
		</AlertContext.Provider>
	);
};

const useAlert = (): AlertContextType => {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error('useAlert must be used within an AlertProvider');
	}
	return context;
};

export { AlertProvider, useAlert };
