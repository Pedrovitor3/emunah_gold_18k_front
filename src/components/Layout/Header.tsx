/**
 * Componente Header com navegação e logout
 * Emunah Gold 18K - Frontend
 */

import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Typography, Button } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  CrownOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  ProfileOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
    } else {
      navigate(key);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: '/perfil',
      icon: <UserOutlined />,
      label: 'Meu Perfil',
    },
    {
      key: '/pedidos',
      icon: <ProfileOutlined />,
      label: 'Meus Pedidos',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      danger: true,
    },
  ];

  const mainMenuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Início',
    },
    {
      key: '/produtos',
      icon: <ShoppingOutlined />,
      label: 'Produtos',
    },
    {
      key: '/carrinho',
      icon: <ShoppingCartOutlined />,
      label: 'Carrinho',
    },
  ];

  return (
    <AntHeader 
      style={{ 
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Logo */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer' 
        }}
        onClick={() => navigate('/')}
      >
        <CrownOutlined 
          style={{ 
            fontSize: '32px', 
            color: '#d4af37',
            marginRight: '12px'
          }} 
        />
        <Text 
          strong 
          style={{ 
            fontSize: '20px',
            color: '#2c3e50'
          }}
        >
          Emunah Gold 18K
        </Text>
      </div>

      {/* Menu de navegação - Desktop */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={mainMenuItems}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '16px'
          }}
          className="desktop-menu"
        />

        {/* Dropdown do usuário */}
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              height: 'auto',
              borderRadius: '8px'
            }}
          >
            <Space>
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#d4af37' }}
              />
              <Text>
                {user?.first_name} {user?.last_name}
              </Text>
            </Space>
          </Button>
        </Dropdown>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .desktop-menu {
              display: none !important;
            }
          }
        `}
      </style>
    </AntHeader>
  );
};

export default Header;