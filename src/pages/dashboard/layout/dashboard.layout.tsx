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
			<div className="flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
				{/* Sidebar — hidden when printing so the invoice prints clean */}
				<div className="print:hidden">
					<DashboardSidebar
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
					/>
				</div>

				{/* Content area */}
				<div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden print:overflow-visible">
					{/*  Site header — also hidden when printing */}
					<div className="print:hidden">
						<DashboardHeader
							sidebarOpen={sidebarOpen}
							setSidebarOpen={setSidebarOpen}
						/>
					</div>

					<main className="grow">
						<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto print:p-0 print:max-w-none">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</ShopProvider>
	);
}

export default DashboardLayout;
