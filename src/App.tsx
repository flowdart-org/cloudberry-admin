import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./config/routes.config";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import PublicLayout from "./components/layout/PublicLayout";
import OrderDetailsPage from "./components/orders/OrderDetailsPage";
import HomeSectionConfigPage from "./pages/HomeSectionConfigPage";
import ProductDetailsPage from "./pages/Products/ProductDetailsPage";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const ProductsList = lazy(() => import("./pages/Products/ProductsList"));
const OrdersList = lazy(() => import("./pages/Orders/OrdersList"));
const UsersList = lazy(() => import("./pages/Users/UsersList"));
const UserDetails = lazy(() => import("./pages/Users/UserDetails"));
const CategoriesList = lazy(() => import("./pages/Categories/CategoriesList"));
const InventoryList = lazy(() => import("./pages/Inventory/InventoryList"));
const GeneralSettings = lazy(() => import("./pages/Settings/GeneralSettings"));
const Login = lazy(() => import("./pages/Auth/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-lg">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route element={<PublicLayout />}>
                <Route path={ROUTES.LOGIN} element={<Login />} />
              </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.PRODUCTS} element={<ProductsList />} />
                <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetailsPage />} />
                <Route path={ROUTES.ORDERS} element={<OrdersList />} />
                <Route path={ROUTES.ORDER_DETAILS} element={<OrderDetailsPage />} />
                <Route path={ROUTES.USERS} element={<UsersList />} />
                <Route path={ROUTES.USER_DETAILS} element={<UserDetails />} />
                <Route path={ROUTES.CATEGORIES} element={<CategoriesList />} />
                <Route path={ROUTES.INVENTORY} element={<InventoryList />} />
                <Route path={ROUTES.SETTINGS} element={<GeneralSettings />} />
                <Route path={ROUTES.HOME_CONFIG} element={<HomeSectionConfigPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
