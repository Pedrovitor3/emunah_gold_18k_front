import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterUser';
import ProtectedRoute from './components/protectedRoute';
// Import suas outras páginas aqui
// import ProductsPage from './pages/ProductsPage';
// etc...

const App: React.FC = () => {
  return (
    <ConfigProvider 
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: '#d4af37',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        },
      }}
    >
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rotas protegidas */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            
            <Route
              path="/produtos"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    {/* Substitua por sua ProductsPage */}
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Produtos</h1>
                      <p>Página de produtos protegida.</p>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    {/* Substitua por sua ProfilePage */}
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Meu Perfil</h1>
                      <p>Página de perfil protegida.</p>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/carrinho"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    {/* Substitua por sua CartPage */}
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Carrinho</h1>
                      <p>Página do carrinho protegida.</p>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    {/* Substitua por sua OrdersPage */}
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Meus Pedidos</h1>
                      <p>Página de pedidos protegida.</p>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirecionar rotas não encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ConfigProvider>
  );
};

export default App;