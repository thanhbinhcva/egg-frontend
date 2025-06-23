// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import BuyersPage from './pages/BuyersPage';
import ProductsPage from './pages/ProductsPage';
import { BuyerProvider } from './context/BuyerContext';
import { ProductProvider } from './context/ProductContext';

export default function App() {
  return (
    <BuyerProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/buyers" replace />} />
            <Route element={<AdminLayout />}>
              <Route path="/buyers" element={<BuyersPage />} />
              <Route path="/products" element={<ProductsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </BuyerProvider>
  );
}
