/**
 * Rota independente para Login
 * Emunah Gold 18K - Frontend
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../pages/Login';

const LoginRoute: React.FC = () => {
  return (
    <ConfigProvider 
      locale={ptBR}
      theme={{
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
          }
        }
      }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default LoginRoute;