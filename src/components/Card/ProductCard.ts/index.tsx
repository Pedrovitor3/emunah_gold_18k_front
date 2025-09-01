import React, { useState } from 'react';
import { Card, Button, Typography, Dropdown, Space } from 'antd';
import {
  ShoppingCartOutlined,
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useAppNavigation } from '../../../hooks/useNavigation';
import type { ProductInterface } from '../../../interface/ProductInterface';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import type { MenuProps } from 'antd';
import CreateProductModal from '../../Modal/ModalProduct';
import ProductModal from '../../Modal/ModalProduct';

const { Meta } = Card;
const { Text } = Typography;

interface ProductCardProps {
  product: ProductInterface;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const { goToProductDetail } = useAppNavigation();
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleCardClick = () => {
    goToProductDetail(product.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToProductDetail(product.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(product.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(product.id);
    }
  };

  // Handlers para o menu do dropdown
  const handleMenuEdit = () => {
    if (onEdit) {
      onEdit(product.id);
    }
  };

  const handleMenuDelete = () => {
    if (onDelete) {
      onDelete(product.id);
    }
  };

  const handleMenuViewDetails = () => {
    goToProductDetail(product.id);
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericPrice);
  };

  // Menu para ações de admin
  const adminMenuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Editar Produto',
      icon: <EditOutlined />,
      onClick: handleMenuEdit,
    },
    {
      key: 'delete',
      label: 'Excluir Produto',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleMenuDelete,
    },
    {
      type: 'divider',
    },
    {
      key: 'view-details',
      label: 'Ver Detalhes',
      icon: <EyeOutlined />,
      onClick: handleMenuViewDetails,
    },
  ];

  // Ações padrão do card
  const defaultActions = [
    <Button
      key="add-to-cart"
      type="primary"
      icon={<ShoppingCartOutlined />}
      onClick={handleAddToCart}
      style={{
        backgroundColor: '#d4af37',
        borderColor: '#d4af37',
      }}
    >
      Adicionar
    </Button>,
    <Button key="view-details" type="link" onClick={handleViewDetails}>
      Ver Detalhes
    </Button>,
  ];

  // Ações para admin
  const adminActions = [
    <Button
      key="add-to-cart"
      type="primary"
      icon={<ShoppingCartOutlined />}
      onClick={handleAddToCart}
      style={{
        backgroundColor: '#d4af37',
        borderColor: '#d4af37',
      }}
    >
      Adicionar
    </Button>,
    // <Button
    //   key="edit"
    //   icon={<EditOutlined />}
    //   onClick={handleEdit}
    //   style={{
    //     color: '#0369a1',
    //     borderColor: '#0369a1',
    //   }}
    // >
    //   Editar
    // </Button>,
    // <Dropdown menu={{ items: adminMenuItems }} trigger={['click']}>
    //   <Button key="more" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
    // </Dropdown>,
  ];

  return (
    <div style={{ position: 'relative' }}>
      <Card
        hoverable
        onClick={handleCardClick}
        cover={
          <div
            style={{
              height: '280px',
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].image_url}
                alt={product.images[0].alt_text || product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            ) : (
              <div
                style={{
                  color: '#d4af37',
                  fontSize: '48px',
                }}
              >
                <StarOutlined />
              </div>
            )}

            {/* Badge de Admin */}
            {user?.is_admin && (
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(3, 105, 161, 0.9)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Admin
              </div>
            )}
          </div>
        }
        actions={user?.is_admin ? adminActions : defaultActions}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: user?.is_admin
            ? '0 4px 12px rgba(3, 105, 161, 0.15)'
            : '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: user?.is_admin ? '1px solid #e0f2fe' : '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Meta
          title={
            <Space direction="vertical" size={4}>
              <Text
                strong
                style={{
                  fontSize: '16px',
                  color: '#1a1a1a',
                  cursor: 'pointer',
                }}
              >
                {product.name}
              </Text>
              {user?.is_admin && (
                <Text
                  type="secondary"
                  style={{
                    fontSize: '12px',
                    color: '#0369a1',
                  }}
                >
                  {/* ID: {product.id} • */}
                  {product.category?.name || 'Sem categoria'}
                </Text>
              )}
            </Space>
          }
          description={
            <div>
              <Text
                type="secondary"
                style={{
                  fontSize: '14px',
                  display: 'block',
                  marginBottom: '8px',
                  cursor: 'pointer',
                }}
              >
                {product.description?.length > 60
                  ? `${product.description.substring(0, 60)}...`
                  : product.description}
              </Text>
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: '18px',
                    color: '#d4af37',
                    cursor: 'pointer',
                  }}
                >
                  {formatPrice(parseFloat(product.price))}
                </Text>
                {user?.is_admin && (
                  <Text
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      background: '#f5f5f5',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Stock: {product.stock_quantity || 'N/A'}
                  </Text>
                )}
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default ProductCard;
