import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProductsList from "./pages/Products/ProductsList";
import OrdersList from "./pages/Orders/OrdersList";
import UsersList from "./pages/Users/UsersList";
import UserDetails from "./pages/Users/UserDetails";
import CategoriesList from "./pages/Categories/CategoriesList";
import InventoryList from "./pages/Inventory/InventoryList";
import GeneralSettings from "./pages/Settings/GeneralSettings";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./config/routes.config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          
          <Route element={<Layout><div /></Layout>}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductsList />} />
            <Route path={ROUTES.ORDERS} element={<OrdersList />} />
            <Route path={ROUTES.USERS} element={<UsersList />} />
            <Route path={ROUTES.USER_DETAILS} element={<UserDetails />} />
            <Route path={ROUTES.CATEGORIES} element={<CategoriesList />} />
            <Route path={ROUTES.INVENTORY} element={<InventoryList />} />
            <Route path={ROUTES.SETTINGS} element={<GeneralSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
