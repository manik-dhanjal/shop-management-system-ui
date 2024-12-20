import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './shared/css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import AddProductPage from './pages/products/add-product.page';
import NavLayout from './pages/nav.layout';
import AllProductPage from '@pages/products/all-products.page';

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
			<Routes>
				<Route element={<NavLayout />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="product">
						<Route path="all" element={<AllProductPage />} />
						<Route path="add" element={<AddProductPage />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
