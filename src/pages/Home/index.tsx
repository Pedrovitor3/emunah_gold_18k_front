
import React, { useEffect, useState } from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  Card, 
  Space, 
  Spin,
  message
} from 'antd';
import { 
  ShoppingCartOutlined, 
  StarOutlined,
  SafetyOutlined,
  TruckOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { getFeaturedProducts } from '../../services/productService';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await getFeaturedProducts(6);
      setFeaturedProducts(products);
    } catch (error) {
      message.error('Erro ao carregar produtos em destaque');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title 
            level={1} 
            style={{ 
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '24px'
            }}
          >
            Elegância em <span style={{ color: '#d4af37' }}>Ouro 18K</span>
          </Title>
          <Paragraph 
            style={{ 
              fontSize: '20px',
              color: '#666666',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}
          >
            Descubra nossa coleção exclusiva de joias em ouro 18K. 
            Qualidade excepcional, designs únicos e a tradição que você merece.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/products')}
              style={{ 
                backgroundColor: '#d4af37',
                borderColor: '#d4af37',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                borderRadius: '8px'
              }}
            >
              Ver Produtos
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/about')}
              style={{ 
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                borderRadius: '8px'
              }}
            >
              Sobre Nós
            </Button>
          </Space>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ color: '#1a1a1a', marginBottom: '16px' }}>
              Produtos em Destaque
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#666666' }}>
              Conheça nossas peças mais especiais
            </Paragraph>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {featuredProducts.map((product) => (
                <Col xs={24} sm={12} md={8} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ 
                        height: '280px', 
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].image_url} 
                            alt={product.images[0].alt_text || product.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                          />
                        ) : (
                          <div style={{ 
                            color: '#d4af37', 
                            fontSize: '48px' 
                          }}>
                            <StarOutlined />
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(product)}
                        style={{ 
                          backgroundColor: '#d4af37',
                          borderColor: '#d4af37'
                        }}
                      >
                        Adicionar
                      </Button>,
                      <Button 
                        type="link"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    ]}
                    style={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Meta
                      title={
                        <Text strong style={{ fontSize: '16px' }}>
                          {product.name}
                        </Text>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            {product.description?.substring(0, 80)}...
                          </Text>
                          <div style={{ marginTop: '8px' }}>
                            <Text strong style={{ 
                              fontSize: '18px', 
                              color: '#d4af37' 
                            }}>
                              {formatPrice(product.price)}
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Button 
              size="large"
              onClick={() => navigate('/products')}
              style={{ 
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                borderRadius: '8px'
              }}
            >
              Ver Todos os Produtos
            </Button>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section style={{ 
        padding: '80px 24px', 
        backgroundColor: '#f8f9fa' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ color: '#1a1a1a', marginBottom: '16px' }}>
              Por que escolher a Emunah Gold?
            </Title>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  color: '#d4af37', 
                  marginBottom: '16px' 
                }}>
                  <StarOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  Qualidade Premium
                </Title>
                <Text style={{ color: '#666666' }}>
                  Ouro 18K certificado com a mais alta qualidade e pureza
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  color: '#d4af37', 
                  marginBottom: '16px' 
                }}>
                  <SafetyOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  Compra Segura
                </Title>
                <Text style={{ color: '#666666' }}>
                  Transações protegidas e dados criptografados
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  color: '#d4af37', 
                  marginBottom: '16px' 
                }}>
                  <TruckOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  Entrega Rápida
                </Title>
                <Text style={{ color: '#666666' }}>
                  Frete grátis e rastreamento em tempo real
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  color: '#d4af37', 
                  marginBottom: '16px' 
                }}>
                  <CreditCardOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  Pagamento Fácil
                </Title>
                <Text style={{ color: '#666666' }}>
                  Cartão de crédito e PIX com total segurança
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Home;

