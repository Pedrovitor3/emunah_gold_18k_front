/**
 * Componente Header
 * Emunah Gold 18K - Frontend
 */

import React, { useState } from 'react';
import { Layout, Menu, Badge, Button, Drawer, Space, Typography, Avatar } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Início</Link>,
    },
    {
      key: '/products',
      icon: <AppstoreOutlined />,
      label: <Link to="/products">Produtos</Link>,
    },
  ];

  const userMenuItems = user ? [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Minha Conta',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ] : [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: 'Entrar',
      onClick: () => navigate('/login'),
    },
  ];

  return (
    <AntHeader 
      style={{ 
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography.Title 
              level={3} 
              style={{ 
                margin: 0, 
                color: '#d4af37',
                fontWeight: 'bold',
                fontSize: '24px'
              }}
            >
              Emunah Gold 18K
            </Typography.Title>
          </Link>
        </div>

        {/* Menu Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="desktop-menu" style={{ display: 'none' }}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{ 
                border: 'none',
                background: 'transparent',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Ações do usuário */}
          <Space size="middle">
            {/* Carrinho */}
            <Badge count={itemCount} size="small">
              <Button
                type="text"
                icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                onClick={() => navigate('/cart')}
                style={{ 
                  border: 'none',
                  boxShadow: 'none',
                  color: '#666'
                }}
              />
            </Badge>

            {/* Usuário */}
            {user ? (
              <Space>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#d4af37' }}
                />
                <Text strong style={{ color: '#666' }}>
                  {user.first_name}
                </Text>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{ color: '#666' }}
                >
                  Sair
                </Button>
              </Space>
            ) : (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
                style={{ 
                  backgroundColor: '#d4af37',
                  borderColor: '#d4af37',
                  borderRadius: '6px'
                }}
              >
                Entrar
              </Button>
            )}

            {/* Menu Mobile */}
            <Button
              className="mobile-menu-button"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              style={{ 
                display: 'none',
                color: '#666'
              }}
            />
          </Space>
        </div>
      </div>

      {/* Drawer para menu mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={[...menuItems, ...userMenuItems]}
          style={{ border: 'none' }}
        />
      </Drawer>

      <style>{`
        @media (min-width: 768px) {
          .desktop-menu {
            display: block !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: inline-flex !important;
          }
        }
      `}</style>
    </AntHeader>
  );
};

export default Header;

