// routes/index.ts - Adicione a rota de detalhes do produto

import React from 'react';
import { RouteObject } from 'react-router-dom';
// Componentes auxiliares (devem ficar antes de qualquer código)
import MainLayout from '../components/Layout/Main';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROUTES } from './routes';

// Lazy loading das páginas para melhor performance
const Home = React.lazy(() => import('../pages/Home'));
const LoginPage = React.lazy(() => import('../pages/Login'));
const RegisterPage = React.lazy(() => import('../pages/RegisterUser'));
const ProductsPage = React.lazy(() => import('../pages/Products'));
const ProductDetail = React.lazy(() => import('../pages/ProductDetail')); // Nova importação
const ProfilePage = React.lazy(() => import('../pages/Profile'));
const CartPage = React.lazy(() => import('../pages/Cart'));
const OrdersPage = React.lazy(() => import('../pages/Orders'));

// Wrapper para rotas protegidas com layout
const ProtectedLayoutRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>
      <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>
    </MainLayout>
  </ProtectedRoute>
);

// Wrapper para rotas públicas
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>
);

// Configuração das rotas
export const routes: RouteObject[] = [
  // Rotas públicas
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // Rotas protegidas
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedLayoutRoute>
        <Home />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: ROUTES.PRODUCTS,
    element: (
      <ProtectedLayoutRoute>
        <ProductsPage />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: `${ROUTES.PRODUCTS}/:id`, // Nova rota para detalhes do produto
    element: (
      <ProtectedLayoutRoute>
        <ProductDetail />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedLayoutRoute>
        <ProfilePage />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: ROUTES.CART,
    element: (
      <ProtectedLayoutRoute>
        <CartPage />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: ROUTES.ORDERS,
    element: (
      <ProtectedLayoutRoute>
        <OrdersPage />
      </ProtectedLayoutRoute>
    ),
  },
];
