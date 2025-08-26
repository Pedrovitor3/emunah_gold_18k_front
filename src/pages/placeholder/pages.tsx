// pages/Products.tsx
import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ProductsPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Produtos</Title>
        <Paragraph>Página de produtos protegida.</Paragraph>
      </Card>
    </div>
  );
};

export default ProductsPage;

// pages/Profile.tsx
export const ProfilePage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Meu Perfil</Title>
        <Paragraph>Página de perfil protegida.</Paragraph>
      </Card>
    </div>
  );
};

// pages/Cart.tsx
export const CartPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Carrinho</Title>
        <Paragraph>Página do carrinho protegida.</Paragraph>
      </Card>
    </div>
  );
};

// pages/Orders.tsx
export const OrdersPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Meus Pedidos</Title>
        <Paragraph>Página de pedidos protegida.</Paragraph>
      </Card>
    </div>
  );
};
