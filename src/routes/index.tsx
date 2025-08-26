// routes/index.ts
import React from 'react';
import { RouteObject } from 'react-router-dom';
// Componentes auxiliares (devem ficar antes de qualquer código)
import MainLayout from '../components/Layout/Main';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy loading das páginas para melhor performance
const Home = React.lazy(() => import('../pages/Home'));
const LoginPage = React.lazy(() => import('../pages/Login'));
const RegisterPage = React.lazy(() => import('../pages/RegisterUser'));
const ProductsPage = React.lazy(() => import('../pages/Products'));
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
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // Rotas protegidas
  {
    path: '/',
    element: (
      <ProtectedLayoutRoute>
        <Home />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: '/produtos',
    element: (
      <ProtectedLayoutRoute>
        <ProductsPage />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: '/perfil',
    element: (
      <ProtectedLayoutRoute>
        <ProfilePage />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: '/carrinho',
    element: (
      <ProtectedLayoutRoute>
        <CartPage />
      </ProtectedLayoutRoute>
    ),
  },
  {
    path: '/pedidos',
    element: (
      <ProtectedLayoutRoute>
        <OrdersPage />
      </ProtectedLayoutRoute>
    ),
  },
];

// Constantes para as rotas (evita erros de digitação)
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
  PRODUCTS: '/produtos',
  PROFILE: '/perfil',
  CART: '/carrinho',
  ORDERS: '/pedidos',
} as const;

// Tipos para TypeScript
export type RouteNames = (typeof ROUTES)[keyof typeof ROUTES];
