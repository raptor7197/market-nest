import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/brand/Dashboard";
import ProductForm from "./pages/brand/ProductForm";
import BrandOrders from "./pages/brand/Orders";
import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="products" element={<Marketplace />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route
          path="checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["brand"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/orders"
          element={
            <ProtectedRoute allowedRoles={["brand"]}>
              <BrandOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/product/new"
          element={
            <ProtectedRoute allowedRoles={["brand"]}>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/product/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["brand"]}>
              <ProductForm />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
