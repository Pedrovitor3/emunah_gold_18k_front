import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Image, Rate, Space, Tag, Typography } from "antd";
import type { ProductInterface } from "../../interface/ProductInterface";
import type React from "react";
const { Title, Text, Paragraph } = Typography;

const ProductCard: React.FC<{ product: ProductInterface }> = ({ product }) => {

  const productHasStock = product.stock_quantity <    0;

  const formatPrice = (price: number): string => {

  return new Intl.NumberFormat('pt-BR',
    {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};


return (


    <Card
      hoverable
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
      }}
      bodyStyle={{ padding: 16 }}
      cover={
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            alt={product.name}
            src={product?.images[0]?.image_url}
            height={240}
            style={{ objectFit: 'cover', width: '100%' }}
            preview={false}
          />
          {/* {product.discount > 0 && (
            <Badge.Ribbon
              text={`-${product.discount}%`}
              color="#d4af37"
              style={{ top: 16, right: -8 }}
            />
          )} */}
          {productHasStock  && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tag color="red" style={{ fontSize: 14, padding: '8px 16px' }}>
                Fora de Estoque
              </Tag>
            </div>
          )}
        </div>
      }
    >
      <div style={{ minHeight: 180 }}>
        <Title level={5} style={{ marginBottom: 8, color: '#1a1a1a' }}>
          {product.name}
        </Title>

        <Paragraph
          style={{ color: '#666', fontSize: 13, marginBottom: 12 }}
          ellipsis={{ rows: 2 }}
        >
          {product.description}
        </Paragraph>

        {/* <div style={{ marginBottom: 12 }}>
          <Space align="center">
            <Rate
              disabled
              defaultValue={product.rating}
              style={{ fontSize: 12, color: '#d4af37' }}
            />
            <Text style={{ color: '#999', fontSize: 12 }}>
              ({product.reviews})
            </Text>
          </Space>
        </div> */}

        <div style={{ marginBottom: 16 }}>
          {product.price > product.price && (
            <Text delete style={{ color: '#999', fontSize: 12, marginRight: 8 }}>
              {formatPrice(parseFloat(product.price))}
            </Text>
          )}
          <Title level={4} style={{ color: '#d4af37', margin: 0 }}>
            {formatPrice(parseFloat(product.price))}
          </Title>
        </div>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            disabled={productHasStock}
            style={{
              background: productHasStock ? '#d4af37' : undefined,
              borderColor: productHasStock? '#d4af37' : undefined,
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            {productHasStock ? 'Adicionar' : 'Indisponível'}
          </Button>
          <Button
            icon={<HeartOutlined />}
            style={{ borderRadius: 8 }}
          />
        </Space>
      </div>
    </Card>
  )};
export default ProductCard;
