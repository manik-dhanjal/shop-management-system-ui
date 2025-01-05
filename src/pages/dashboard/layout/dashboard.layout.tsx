import { useEffect, useState } from 'react';
import DashboardSidebar from '../../../features/dashboard/components/dashboard-sidebar.component';
import DashboardHeader from '../../../features/dashboard/components/dashboard-header.component';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/auth.hooks';
import { CircularProgress } from '@mui/material';
import { ShopProvider } from '@shared/context/shop.context';
import ShopSetupPage from '../shop/shop-setup.page';

function DashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const auth = useAuth();
	const navigate = useNavigate();
	const [isFetchingUser, setIsFetchingUser] = useState(true);

	useEffect(() => {
		(async () => {
			setIsFetchingUser(true);
			try {
				await auth.refreshUser();
			} catch (error) {
				navigate('/login');
			} finally {
				setIsFetchingUser(false);
			}
		})();
	}, []);

	if (isFetchingUser)
		return (
			<div className="w-screen h-screen flex flex-col justify-center items-center gap-6">
				<CircularProgress className="self-center" />
				<div>Loading dashboard...</div>
			</div>
		);

	if (!auth.activeShop) return <ShopSetupPage />;

	return (
		<ShopProvider activeShop={auth.activeShop}>
			<div className="flex h-screen overflow-hidden">
				{/* Sidebar */}
				<DashboardSidebar
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				{/* Content area */}
				<div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
					{/*  Site header */}
					<DashboardHeader
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
					/>

					<main className="grow">
						<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</ShopProvider>
	);
}

export default DashboardLayout;
