/**
 * Layout principal da aplicação
 * Emunah Gold 18K - Frontend
 */

import React from 'react';
import { Layout } from 'antd';
import Header from './Header';

const { Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      
      <Content style={{ 
        padding: '24px',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          width: '100%'
        }}>
          {children}
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center',
        background: '#2c3e50',
        color: '#fff',
        padding: '24px 0'
      }}>
        <div style={{ color: '#d4af37', fontSize: '16px', fontWeight: 'bold' }}>
          Emunah Gold 18K
        </div>
        <div style={{ marginTop: '8px', opacity: 0.8 }}>
          © 2024 Emunah Gold 18K. Todos os direitos reservados.
        </div>
        <div style={{ marginTop: '4px', fontSize: '14px', opacity: 0.7 }}>
          Joias exclusivas em ouro 18K
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;