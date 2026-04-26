import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import ProductCatalog from "./pages/doctor/ProductCatalog";
import ProductDetails from "./pages/doctor/ProductDetails";
import Cart from "./pages/doctor/Cart";
import Orders from "./pages/doctor/Orders";
import DoctorProfile from "./pages/doctor/Profile";

// Sales Rep Pages
import SalesRepDashboard from "./pages/sales/Dashboard";
import DoctorManagement from "./pages/sales/DoctorManagement";
import DoctorProfileView from "./pages/sales/DoctorProfile";
import OrderQueue from "./pages/sales/OrderQueue";
import SalesProfile from "./pages/sales/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderMonitoring from "./pages/admin/OrderMonitoring";
import AdminRequests from "./pages/admin/Requests";

import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  // Doctor Routes
  {
    path: "/doctor",
    children: [
      { index: true, Component: DoctorDashboard },
      { path: "products", Component: ProductCatalog },
      { path: "products/:id", Component: ProductDetails },
      { path: "cart", Component: Cart },
      { path: "orders", Component: Orders },
      { path: "profile", Component: DoctorProfile },
    ],
  },
  // Sales Rep Routes
  {
    path: "/sales",
    children: [
      { index: true, Component: SalesRepDashboard },
      { path: "doctors", Component: DoctorManagement },
      { path: "doctors/:id", Component: DoctorProfileView },
      { path: "orders", Component: OrderQueue },
      { path: "profile", Component: SalesProfile },
    ],
  },
  // Admin Routes
  {
    path: "/admin",
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users", Component: UserManagement },
      { path: "products", Component: ProductManagement },
      { path: "orders", Component: OrderMonitoring },
      { path: "requests", Component: AdminRequests },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
