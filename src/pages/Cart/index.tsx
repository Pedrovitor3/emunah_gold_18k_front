import React, { useState, useEffect } from 'react';
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
  Alert,
  Modal,
  message,
  Spin,
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
  LoadingOutlined,
} from '@ant-design/icons';
import {
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../../services/cartService';

const { Title, Text, Paragraph } = Typography;

interface CartItemData {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    sku: string;
    weight?: number;
    gold_purity: string;
    stock_quantity: number;
    images: Array<{
      id: string;
      url: string;
      alt_text?: string;
      is_primary: boolean;
    }>;
  };
}

interface AppliedCoupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Carregar itens do carrinho
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const response = await getCartItems();

      if (response.success) {
        setCartItems(response.data || []);
      } else {
        message.error('Erro ao carregar carrinho');
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      message.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    // Verificar estoque antes de atualizar
    const item = cartItems.find((item) => item.product_id === productId);
    if (item && newQuantity > item.product.stock_quantity) {
      message.error('Quantidade não disponível em estoque');
      return;
    }

    setUpdating((prev) => ({ ...prev, [productId]: true }));

    try {
      const response = await updateCartItem(productId, newQuantity);

      if (response.success) {
        setCartItems((items) =>
          items.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: newQuantity, updated_at: new Date().toISOString() }
              : item
          )
        );
        message.success('Quantidade atualizada');
      } else {
        message.error(response.error || 'Erro ao atualizar quantidade');
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      message.error('Erro ao conectar com o servidor');
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId: string) => {
    const item = cartItems.find((item) => item.product_id === productId);

    try {
      const response = await removeFromCart(productId);

      if (response.success) {
        // Remove o item do estado local
        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
        message.success('Item removido do carrinho');
      } else {
        message.error(response.error || 'Erro ao remover item');
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      message.error('Erro ao conectar com o servidor');
    }
  };

  const handleClearCart = async () => {
    setLoading(true);

    try {
      const response = await clearCart();

      if (response.success) {
        setCartItems([]);
        message.success('Carrinho limpo com sucesso');
      } else {
        message.error(response.error || 'Erro ao limpar carrinho');
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      message.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    // Simulação de aplicação de cupom - você pode integrar com sua API de cupons
    if (couponCode === 'GOLD10') {
      setAppliedCoupon({ code: 'GOLD10', discount: 0.1, type: 'percentage' });
      message.success('Cupom aplicado com sucesso!');
    } else if (couponCode === 'SAVE50') {
      setAppliedCoupon({ code: 'SAVE50', discount: 50, type: 'fixed' });
      message.success('Cupom aplicado com sucesso!');
    } else {
      message.error('Cupom inválido');
    }
  };

  const getImageUrl = (product: CartItemData['product']) => {
    const primaryImage = product.images?.find((img) => img.is_primary);
    return primaryImage?.url || product.images?.[0]?.url || '/placeholder-product.jpg';
  };

  // Cálculos
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 29.9;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? subtotal * appliedCoupon.discount
      : appliedCoupon.discount
    : 0;
  const total = subtotal + shipping - discount;

  const CartItem: React.FC<{ item: CartItemData }> = ({ item }) => (
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
            src={getImageUrl(item.product)}
            alt={item.product.name}
            width={80}
            height={80}
            style={{ borderRadius: 8, objectFit: 'cover' }}
            preview={false}
            fallback="/placeholder-product.jpg"
          />
        </Col>

        <Col xs={18} sm={12}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0, color: '#1a1a1a' }}>
              {item.product.name}
              {updating[item.product_id] && (
                <LoadingOutlined style={{ marginLeft: 8, color: '#d4af37' }} />
              )}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              SKU: {item.product.sku} • {item.product.gold_purity}
              {item.product.weight && ` • ${item.product.weight}g`}
            </Text>
            <Space>
              <Text strong style={{ color: '#d4af37', fontSize: 16 }}>
                {formatPrice(item.product.price)}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Estoque: {item.product.stock_quantity}
              </Text>
            </Space>
            {item.product.stock_quantity < 5 && <Tag color="orange">Últimas unidades</Tag>}
          </Space>
        </Col>

        <Col xs={24} sm={8}>
          <Row gutter={8} align="middle" justify="space-between">
            <Col>
              <Space>
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  style={{ borderRadius: 6 }}
                  disabled={updating[item.product_id]}
                  loading={updating[item.product_id]}
                />
                <InputNumber
                  min={1}
                  max={item.product.stock_quantity}
                  value={item.quantity}
                  onChange={(value) => updateQuantity(item.product_id, value || 1)}
                  style={{ width: 60, textAlign: 'center' }}
                  controls={false}
                  disabled={updating[item.product_id]}
                />
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  style={{ borderRadius: 6 }}
                  disabled={
                    updating[item.product_id] || item.quantity >= item.product.stock_quantity
                  }
                  loading={updating[item.product_id]}
                />
              </Space>
            </Col>
            <Col>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeItem(item.product_id)}
                style={{ borderRadius: 6 }}
                disabled={updating[item.product_id]}
                loading={updating[item.product_id]}
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

  if (loading) {
    return (
      <div
        style={{
          padding: '24px 0',
          background: '#fafafa',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0', background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1a1a1a', marginBottom: 8 }}>
            Carrinho de Compras
            {cartItems.length > 0 && (
              <Button
                type="text"
                danger
                size="small"
                onClick={() => handleClearCart()}
                style={{ marginLeft: 16, fontSize: 12 }}
              >
                Limpar carrinho
              </Button>
            )}
          </Title>
          <Paragraph style={{ color: '#666', fontSize: 16 }}>
            {cartItems.length > 0
              ? `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'} no seu carrinho`
              : 'Revise seus itens antes de finalizar a compra'}
          </Paragraph>
        </div>

        {/* Progress Steps */}
        {cartItems.length > 0 && (
          <Card
            style={{
              marginBottom: 32,
              borderRadius: 12,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            bodyStyle={{ padding: '24px 32px' }}
          >
            <Steps current={currentStep} items={steps} style={{ marginBottom: 0 }} />
          </Card>
        )}

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
                  {cartItems.map((item) => (
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
                        <Tag color="success">
                          {appliedCoupon.type === 'percentage'
                            ? `-${appliedCoupon.discount * 100}%`
                            : `-${formatPrice(appliedCoupon.discount)}`}
                        </Tag>
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
                        placeholder="Digite seu cupom (ex: GOLD10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        style={{ borderRadius: '8px 0 0 8px' }}
                        onPressEnter={applyCoupon}
                      />
                      <Button
                        type="primary"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
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
                    <Text>
                      Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} itens)
                    </Text>
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
                      <Text style={{ color: '#52c41a' }}>Desconto ({appliedCoupon.code})</Text>
                      <Text style={{ color: '#52c41a' }}>-{formatPrice(discount)}</Text>
                    </div>
                  )}

                  <Divider style={{ margin: '12px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      Total
                    </Title>
                    <Title level={4} style={{ margin: 0, color: '#d4af37' }}>
                      {formatPrice(total)}
                    </Title>
                  </div>

                  {/* Free Shipping Alert */}
                  {shipping > 0 && subtotal < 500 && (
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
                      Finalizar Compra ({formatPrice(total)})
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
                      <Text style={{ fontSize: 12, color: '#666' }}>Pagamento seguro</Text>
                    </Space>
                    <Space size="small">
                      <TruckOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ fontSize: 12, color: '#666' }}>Entrega garantida</Text>
                    </Space>
                    <Space size="small">
                      <GiftOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ fontSize: 12, color: '#666' }}>Garantia estendida</Text>
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
                    Descubra nossas joias exclusivas em ouro 18K
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
                Ver Produtos
              </Button>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartPage;
