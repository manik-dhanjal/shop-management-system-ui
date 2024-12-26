import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './shared/css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import AddEditProduct from './pages/products/add-edit-product.page';
import NavLayout from './pages/nav.layout';
import AllProductPage from '@pages/products/all-products.page';
import { GlobalLoadingProvider } from '@shared/hoc/global-loading.component';
import { AlertProvider } from '@shared/hoc/alert.component';

function App() {
	const location = useLocation();
	useEffect(() => {
		const htmlRef = document.querySelector('html');
		if (htmlRef) {
			htmlRef.style.scrollBehavior = 'auto';
			window.scroll({ top: 0 });
			htmlRef.style.scrollBehavior = '';
		}
	}, [location.pathname]); // triggered on route change

	return (
		<>
			<GlobalLoadingProvider>
				<AlertProvider>
					<Routes>
						<Route element={<NavLayout />}>
							<Route path="/" element={<Dashboard />} />
							<Route path="product">
								<Route path="all" element={<AllProductPage />} />
								<Route
									path="add"
									element={<AddEditProduct isEditing={false} />}
								/>
								<Route
									path=":productId/edit"
									element={<AddEditProduct isEditing={true} />}
								/>
							</Route>
						</Route>
					</Routes>
				</AlertProvider>
			</GlobalLoadingProvider>
		</>
	);
}

export default App;
