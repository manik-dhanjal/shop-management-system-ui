import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@shared/context/auth.context';
import { GlobalLoadingProvider } from '@shared/context/global-loading.context';
import { AlertProvider } from '@shared/context/alert.context';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import muiTheme from '@utils/mui.theme';

export const queryClient = new QueryClient();

const rootRef = document.getElementById('root');
if (rootRef) {
	ReactDOM.createRoot(rootRef).render(
		<React.StrictMode>
			<Router>
				<MuiThemeProvider theme={muiTheme}>
					<ThemeProvider>
						<QueryClientProvider client={queryClient}>
							<GlobalLoadingProvider>
								<AuthProvider>
									<AlertProvider>
										<App />
									</AlertProvider>
								</AuthProvider>
							</GlobalLoadingProvider>
							<ReactQueryDevtools initialIsOpen={false} />
						</QueryClientProvider>
					</ThemeProvider>
				</MuiThemeProvider>
			</Router>
		</React.StrictMode>
	);
}
