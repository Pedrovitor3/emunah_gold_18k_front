import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Routes
import { routes } from './routes';

// Tema do Ant Design
const theme = {
  token: {
    colorPrimary: '#d4af37',
    borderRadius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  },
  components: {
    Card: {
      borderRadiusLG: 20,
    },
    Input: {
      borderRadius: 12,
      paddingInline: 16,
      paddingBlock: 12,
    },
    Button: {
      borderRadius: 12,
      fontWeight: 600,
    },
  },
};

// Criar o router com as rotas centralizadas
const router = createBrowserRouter([
  ...routes,
  // Rota catch-all para redirecionar para home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const App: React.FC = () => {
  return (
    <ConfigProvider locale={ptBR} theme={theme}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;