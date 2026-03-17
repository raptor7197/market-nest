import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/brand/Dashboard';
import ProductForm from './pages/brand/ProductForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="products" element={<Marketplace />} />
        <Route path="products/:id" element={<ProductDetails />} />
        
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['brand']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/product/new"
          element={
            <ProtectedRoute allowedRoles={['brand']}>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/product/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['brand']}>
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
