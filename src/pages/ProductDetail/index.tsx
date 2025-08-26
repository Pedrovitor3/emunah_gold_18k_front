import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Space,
  Spin,
  message,
  Image,
  Divider,
  Tag,
  InputNumber,
  Breadcrumb,
  Carousel,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  StarFilled,
  SafetyCertificateOutlined,
  TruckOutlined,
  RetweetOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAppNavigation } from '../../hooks/useNavigation';
import { useCart } from '../../contexts/CartContext';
import type { ProductInterface } from '../../interface/ProductInterface';
import { ROUTE_TITLES, ROUTES } from '../../routes/routes';
import { getProductById } from '../../services/productService';

const { Title, Paragraph, Text } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { goToProducts } = useAppNavigation();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const productData = await getProductById(productId);
      setProduct(productData);
    } catch (error) {
      message.error('Erro ao carregar detalhes do produto');
      goToProducts(); // Usando o hook ao invés de navigate direto
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      message.success(
        `${quantity} ${quantity === 1 ? 'item adicionado' : 'itens adicionados'} ao carrinho`
      );
    }
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericPrice);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.image_url)
      : ['/placeholder-product.jpg'];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 0' }}>
        <Breadcrumb
          items={[
            {
              href: ROUTES.HOME,
              title: <HomeOutlined />,
            },
            {
              href: ROUTES.PRODUCTS,
              title: (
                <>
                  <AppstoreOutlined />
                  <span>{ROUTE_TITLES[ROUTES.PRODUCTS]}</span>
                </>
              ),
            },
            {
              title: product.name,
            },
          ]}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <Row gutter={[48, 48]} align="top">
          {/* Images Section */}
          <Col xs={24} lg={12}>
            <div style={{ position: 'sticky', top: 24 }}>
              {/* Main Image */}
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#f8f9fa',
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  preview={false}
                />
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <Row gutter={12}>
                  {productImages.map((image, index) => (
                    <Col key={index} span={6}>
                      <div
                        style={{
                          aspectRatio: '1/1',
                          borderRadius: 8,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border:
                            selectedImageIndex === index
                              ? '2px solid #d4af37'
                              : '2px solid transparent',
                          background: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>

          {/* Product Info Section */}
          <Col xs={24} lg={12}>
            <div style={{ paddingLeft: 0 }}>
              {/* Product Title */}
              <Title
                level={1}
                style={{
                  fontSize: '32px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: 8,
                  lineHeight: '1.2',
                }}
              >
                {product.name}
              </Title>

              {/* Category */}
              <div style={{ marginBottom: 16 }}>
                <Tag
                  color="gold"
                  style={{
                    borderRadius: 16,
                    padding: '4px 12px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {product.category.name}
                </Tag>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: 24 }}>
                <Space align="center">
                  <Space>
                    {[...Array(5)].map((_, i) => (
                      <StarFilled
                        key={i}
                        style={{
                          color: i < 4 ? '#d4af37' : '#e8e8e8',
                          fontSize: '16px',
                        }}
                      />
                    ))}
                  </Space>
                  <Text style={{ color: '#666', fontSize: '14px' }}>4.8 (127 avaliações)</Text>
                </Space>
              </div>

              {/* Price */}
              <div style={{ marginBottom: 32 }}>
                <Text
                  style={{
                    fontSize: '36px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    lineHeight: '1',
                  }}
                >
                  {formatPrice(parseFloat(product.price))}
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Text style={{ color: '#666', fontSize: '14px' }}>
                    ou 12x de {formatPrice(parseFloat(product.price) / 12)} sem juros
                  </Text>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 32 }}>
                <Paragraph
                  style={{
                    fontSize: '16px',
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: 0,
                  }}
                >
                  {product.description}
                </Paragraph>
              </div>

              <Divider style={{ margin: '32px 0' }} />

              {/* Quantity Selector */}
              <div style={{ marginBottom: 32 }}>
                <Text style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a' }}>
                  Quantidade:
                </Text>
                <div style={{ marginTop: 8 }}>
                  <InputNumber
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    size="large"
                    style={{ width: 120 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginBottom: 32 }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    style={{
                      width: '100%',
                      height: 56,
                      backgroundColor: '#d4af37',
                      borderColor: '#d4af37',
                      borderRadius: 8,
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Adicionar ao Carrinho
                  </Button>

                  <Row gutter={12}>
                    <Col span={12}>
                      <Button
                        size="large"
                        icon={<HeartOutlined />}
                        style={{
                          width: '100%',
                          height: 48,
                          borderRadius: 8,
                          fontSize: '14px',
                        }}
                      >
                        Favoritar
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        size="large"
                        icon={<ShareAltOutlined />}
                        style={{
                          width: '100%',
                          height: 48,
                          borderRadius: 8,
                          fontSize: '14px',
                        }}
                      >
                        Compartilhar
                      </Button>
                    </Col>
                  </Row>
                </Space>
              </div>

              <Divider style={{ margin: '32px 0' }} />

              {/* Product Features */}
              <div>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SafetyCertificateOutlined
                      style={{ color: '#d4af37', fontSize: '20px', marginRight: 12 }}
                    />
                    <div>
                      <Text style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                        Ouro 18K Certificado
                      </Text>
                      <div>
                        <Text style={{ fontSize: '12px', color: '#666' }}>
                          Qualidade garantida e certificada
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TruckOutlined
                      style={{ color: '#d4af37', fontSize: '20px', marginRight: 12 }}
                    />
                    <div>
                      <Text style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                        Frete Grátis
                      </Text>
                      <div>
                        <Text style={{ fontSize: '12px', color: '#666' }}>
                          Entrega em 2-3 dias úteis
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RetweetOutlined
                      style={{ color: '#d4af37', fontSize: '20px', marginRight: 12 }}
                    />
                    <div>
                      <Text style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                        Troca Garantida
                      </Text>
                      <div>
                        <Text style={{ fontSize: '12px', color: '#666' }}>
                          30 dias para trocas e devoluções
                        </Text>
                      </div>
                    </div>
                  </div>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Product Specifications */}
      <div style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 40, color: '#1a1a1a' }}>
            Especificações
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card style={{ height: '100%', borderRadius: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <SafetyCertificateOutlined
                    style={{ fontSize: '32px', color: '#d4af37', marginBottom: 16 }}
                  />
                  <Title level={5}>Material</Title>
                  <Text style={{ color: '#666' }}>Ouro 18K (750)</Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ height: '100%', borderRadius: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <StarFilled style={{ fontSize: '32px', color: '#d4af37', marginBottom: 16 }} />
                  <Title level={5}>Acabamento</Title>
                  <Text style={{ color: '#666' }}>Polido Premium</Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ height: '100%', borderRadius: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <SafetyCertificateOutlined
                    style={{ fontSize: '32px', color: '#d4af37', marginBottom: 16 }}
                  />
                  <Title level={5}>Garantia</Title>
                  <Text style={{ color: '#666' }}>2 anos</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
