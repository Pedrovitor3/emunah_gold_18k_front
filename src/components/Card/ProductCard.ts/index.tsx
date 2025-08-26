import React from 'react';
import { Card, Button, Typography } from 'antd';
import { ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { useAppNavigation } from '../../../hooks/useNavigation';
import type { ProductInterface } from '../../../interface/ProductInterface';
import { useCart } from '../../../contexts/CartContext';

const { Meta } = Card;
const { Text } = Typography;

interface ProductCardProps {
  product: ProductInterface;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { goToProductDetail } = useAppNavigation();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique propague para o card
    addItem(product, 1);
  };

  const handleCardClick = () => {
    goToProductDetail(product.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique propague para o card
    goToProductDetail(product.id);
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericPrice);
  };

  return (
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
        </div>
      }
      actions={[
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
      ]}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <Meta
        title={
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
            <div style={{ marginTop: '8px' }}>
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
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
