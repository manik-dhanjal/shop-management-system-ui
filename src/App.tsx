import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./shared/css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "@pages/dashboard/anaytics/analytics-main.page";
import HomePage from "@shared/introduction/home/home.page";
import DashboardLayout from "@pages/dashboard/layout/dashboard.layout";
import IntroductionLayout from "@shared/introduction/layout/introduction.layout";
import LoginPage from "@shared/introduction/auth/login.page";
import SignupPage from "@shared/introduction/auth/signup.page";
import AddProductPage from "@pages/dashboard/product/add-product.page";
import { EditProductPage } from "@pages/dashboard/product/edit-product.page";
import AddShopPage from "@pages/dashboard/shop/add-shop.page";
import AllProductPage from "@pages/dashboard/product/all-products.page";
import AddEmployeePage from "@pages/dashboard/employee/add-employee.page";
import AllEmployeePage from "@pages/dashboard/employee/all-employee.page";
import { EditEmployeePage } from "@pages/dashboard/employee/edit-employee.page";
import { AddOrderPage } from "@pages/dashboard/order/add-order.page";
import { AllOrdersPage } from "@pages/dashboard/order/all-orders.page";

function App() {
  const location = useLocation();
  useEffect(() => {
    const htmlRef = document.querySelector("html");
    if (htmlRef) {
      htmlRef.style.scrollBehavior = "auto";
      window.scroll({ top: 0 });
      htmlRef.style.scrollBehavior = "";
    }
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        {/* Introduction */}
        <Route element={<IntroductionLayout />} path="/">
          <Route element={<HomePage />} path="" />
          <Route element={<LoginPage />} path="login" />
          <Route element={<SignupPage />} path="signup" />
        </Route>

        {/* Dashboard */}
        <Route element={<DashboardLayout />} path="dashboard">
          <Route element={<Dashboard />} path="analytics" />
          <Route path="product">
            <Route path="all" element={<AllProductPage />} />
            <Route path="add" element={<AddProductPage />} />
            <Route path=":productId/edit" element={<EditProductPage />} />
          </Route>
          <Route path="shop">
            <Route path="add" element={<AddShopPage />} />
          </Route>
          <Route path="inventory"></Route>
          <Route path="employee">
            <Route path="add" element={<AddEmployeePage />} />
            <Route path="all" element={<AllEmployeePage />} />
            <Route path=":employeeId/edit" element={<EditEmployeePage />} />
          </Route>
          <Route path="order">
            <Route path="add" element={<AddOrderPage />} />
            <Route path="all" element={<AllOrdersPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
