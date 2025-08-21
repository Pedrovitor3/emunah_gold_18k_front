import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Image,
  InputNumber,
  Divider,
  Empty,
  Tag,
  Steps,
  Input,
  Select,
  Form,
  Checkbox,
  Alert,
  Modal,
  message,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  TruckOutlined,
  SafetyOutlined,
  GiftOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Mock data para itens do carrinho
const mockCartItems = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 7999.90,
    originalPrice: 8999.90,
    image: 'https://images.unsplash.com/photo-1696446702061-95c0d5ae964e?w=150',
    quantity: 1,
    inStock: true,
    category: 'Smartphone',
    brand: 'Apple',
  },
  {
    id: 2,
    name: 'AirPods Pro 2ª Geração',
    price: 1899.90,
    originalPrice: 2099.90,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=150',
    quantity: 2,
    inStock: true,
    category: 'Áudio',
    brand: 'Apple',
  },
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    Modal.confirm({
      title: 'Remover item',
      content: 'Tem certeza que deseja remover este item do carrinho?',
      okText: 'Sim, remover',
      cancelText: 'Cancelar',
      okButtonProps: { style: { background: '#d4af37', borderColor: '#d4af37' } },
      onOk: () => {
        setCartItems(items => items.filter(item => item.id !== id));
        message.success('Item removido do carrinho');
      },
    });
  };

  const applyCoupon = () => {
    if (couponCode === 'GOLD10') {
      setAppliedCoupon({ code: 'GOLD10', discount: 0.1, type: 'percentage' });
      message.success('Cupom aplicado com sucesso!');
    } else {
      message.error('Cupom inválido');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 29.90;
  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const total = subtotal + shipping - discount;

  const CartItem: React.FC<{ item: any }> = ({ item }) => (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
      bodyStyle={{ padding: 20 }}
    >
      <Row gutter={16} align="middle">
        <Col xs={6} sm={4}>
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            style={{ borderRadius: 8, objectFit: 'cover' }}
            preview={false}
          />
        </Col>
        
        <Col xs={18} sm={12}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a' }}>
              {item.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {item.brand} • {item.category}
            </Text>
            <Space>
              {item.originalPrice > item.price && (
                <Text delete style={{ color: '#999', fontSize: 12 }}>
                  {formatPrice(item.originalPrice)}
                </Text>
              )}
              <Text strong style={{ color: '#d4af37', fontSize: 16 }}>
                {formatPrice(item.price)}
              </Text>
            </Space>
          </Space>
        </Col>

        <Col xs={24} sm={8}>
          <Row gutter={8} align="middle" justify="space-between">
            <Col>
              <Space>
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ borderRadius: 6 }}
                />
                <InputNumber
                  min={1}
                  max={10}
                  value={item.quantity}
                  onChange={(value) => updateQuantity(item.id, value || 1)}
                  style={{ width: 60, textAlign: 'center' }}
                  controls={false}
                />
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ borderRadius: 6 }}
                />
              </Space>
            </Col>
            <Col>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeItem(item.id)}
                style={{ borderRadius: 6 }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );

  const steps = [
    {
      title: 'Carrinho',
      icon: <ShoppingCartOutlined />,
    },
    {
      title: 'Entrega',
      icon: <TruckOutlined />,
    },
    {
      title: 'Pagamento',
      icon: <CreditCardOutlined />,
    },
  ];

  return (
    <div style={{ padding: '24px 0', background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1a1a1a', marginBottom: 8 }}>
            Carrinho de Compras
          </Title>
          <Paragraph style={{ color: '#666', fontSize: 16 }}>
            Revise seus itens antes de finalizar a compra
          </Paragraph>
        </div>

        {/* Progress Steps */}
        <Card
          style={{
            marginBottom: 32,
            borderRadius: 12,
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          bodyStyle={{ padding: '24px 32px' }}
        >
          <Steps
            current={currentStep}
            items={steps}
            style={{ marginBottom: 0 }}
          />
        </Card>

        {cartItems.length > 0 ? (
          <Row gutter={[24, 24]}>
            {/* Cart Items */}
            <Col xs={24} lg={16}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Security Badge */}
                <Alert
                  message={
                    <Space>
                      <SafetyOutlined style={{ color: '#52c41a' }} />
                      <Text>Compra 100% segura e protegida</Text>
                    </Space>
                  }
                  type="success"
                  showIcon={false}
                  style={{ borderRadius: 8, border: '1px solid #b7eb8f' }}
                />

                {/* Items List */}
                <div>
                  {cartItems.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Coupon Section */}
                <Card
                  title={
                    <Space>
                      <PercentageOutlined style={{ color: '#d4af37' }} />
                      <Text>Cupom de Desconto</Text>
                    </Space>
                  }
                  style={{
                    borderRadius: 12,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  bodyStyle={{ padding: '20px 24px' }}
                >
                  {appliedCoupon ? (
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>Cupom {appliedCoupon.code} aplicado</Text>
                        <Tag color="success">-{(appliedCoupon.discount * 100)}%</Tag>
                      </Space>
                      <Button
                        type="link"
                        onClick={() => setAppliedCoupon(null)}
                        style={{ color: '#d4af37' }}
                      >
                        Remover
                      </Button>
                    </Space>
                  ) : (
                    <Space.Compact style={{ width: '100%' }}>
                      <Input
                        placeholder="Digite seu cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{ borderRadius: '8px 0 0 8px' }}
                      />
                      <Button
                        type="primary"
                        onClick={applyCoupon}
                        style={{
                          background: '#d4af37',
                          borderColor: '#d4af37',
                          borderRadius: '0 8px 8px 0',
                        }}
                      >
                        Aplicar
                      </Button>
                    </Space.Compact>
                  )}
                </Card>
              </Space>
            </Col>

            {/* Order Summary */}
            <Col xs={24} lg={8}>
              <Card
                title="Resumo do Pedido"
                style={{
                  borderRadius: 12,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  position: 'sticky',
                  top: 24,
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {/* Summary Lines */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Subtotal ({cartItems.length} itens)</Text>
                    <Text>{formatPrice(subtotal)}</Text>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                      <Text>Frete</Text>
                      {shipping === 0 && (
                        <Tag color="success" style={{ fontSize: 10 }}>
                          GRÁTIS
                        </Tag>
                      )}
                    </Space>
                    <Text>{shipping === 0 ? 'Grátis' : formatPrice(shipping)}</Text>
                  </div>

                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#52c41a' }}>Desconto</Text>
                      <Text style={{ color: '#52c41a' }}>-{formatPrice(discount)}</Text>
                    </div>
                  )}

                  <Divider style={{ margin: '12px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={4} style={{ margin: 0 }}>Total</Title>
                    <Title level={4} style={{ margin: 0, color: '#d4af37' }}>
                      {formatPrice(total)}
                    </Title>
                  </div>

                  {/* Free Shipping Alert */}
                  {shipping > 0 && (
                    <Alert
                      message={`Adicione mais ${formatPrice(500 - subtotal)} para frete grátis!`}
                      type="info"
                      showIcon
                      style={{ fontSize: 12, borderRadius: 6 }}
                    />
                  )}

                  {/* Action Buttons */}
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button
                      type="primary"
                      size="large"
                      block
                      style={{
                        background: '#d4af37',
                        borderColor: '#d4af37',
                        borderRadius: 8,
                        fontWeight: 600,
                        height: 48,
                      }}
                      onClick={() => setCurrentStep(1)}
                    >
                      Finalizar Compra
                    </Button>

                    <Button
                      block
                      style={{ borderRadius: 8, height: 40 }}
                      onClick={() => window.history.back()}
                    >
                      Continuar Comprando
                    </Button>
                  </Space>

                  {/* Trust Badges */}
                  <Divider style={{ margin: '16px 0 12px 0' }} />
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space size="small">
                      <SafetyOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        Pagamento seguro
                      </Text>
                    </Space>
                    <Space size="small">
                      <TruckOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        Entrega garantida
                      </Text>
                    </Space>
                    <Space size="small">
                      <GiftOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        Garantia estendida
                      </Text>
                    </Space>
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>
        ) : (
          <Card
            style={{
              borderRadius: 12,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textAlign: 'center',
              padding: '40px 20px',
            }}
          >
            <Empty
              image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d4af37' }} />}
              description={
                <Space direction="vertical" size="middle">
                  <Title level={4} style={{ color: '#666', margin: 0 }}>
                    Seu carrinho está vazio
                  </Title>
                  <Paragraph style={{ color: '#999', margin: 0 }}>
                    Adicione produtos incríveis ao seu carrinho
                  </Paragraph>
                </Space>
              }
            >
              <Button
                type="primary"
                size="large"
                style={{
                  background: '#d4af37',
                  borderColor: '#d4af37',
                  borderRadius: 8,
                  fontWeight: 500,
                  marginTop: 16,
                }}
                onClick={() => window.history.back()}
              >
                Começar a Comprar
              </Button>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartPage;