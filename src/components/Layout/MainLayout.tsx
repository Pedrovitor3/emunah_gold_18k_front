/**
 * Layout principal da aplicação
 * Emunah Gold 18K - Frontend
 */

import React from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ 
        background: '#ffffff',
        minHeight: 'calc(100vh - 64px - 200px)' // Altura da tela menos header e footer
      }}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;

