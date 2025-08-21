

import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Button, 
  Radio, 
  Divider, 
  Typography, 
  Space,
  message,
  Spin,
  Steps,
  Modal
} from 'antd';
import { 
  CreditCardOutlined, 
  QrcodeOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const { Title, Text } = Typography;
const { Step } = Steps;

interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

interface OrderResponse {
  orderId: string;
  orderNumber: string;
  total: number;
  pixData?: {
    qrCode: string;
    code: string;
  };
}

const Checkout: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('pix');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      message.warning('Você precisa estar logado para finalizar a compra');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      message.warning('Seu carrinho está vazio');
      navigate('/');
      return;
    }
  }, [user, items, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleFinishOrder = async (values: any) => {
    setLoading(true);
    
    try {
      const shippingAddress: ShippingAddress = {
        street: values.street,
        number: values.number,
        complement: values.complement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code.replace(/\D/g, '')
      };

      const orderResponse = await apiService.createOrder({
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        notes: values.notes
      });

      setOrderData(orderResponse);
      setCurrentStep(2);

      if (paymentMethod === 'pix') {
        setShowPixModal(true);
      }

      clearCart();
      message.success('Pedido criado com sucesso!');
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!orderData) return;

    setLoading(true);
    try {
      await apiService.confirmPayment(orderData.orderId);
      message.success('Pagamento confirmado com sucesso!');
      setShowPixModal(false);
      navigate(`/orders/${orderData.orderId}`);
    } catch (error: any) {
      message.error(error.message || 'Erro ao confirmar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = total >= 500 ? 0 : 25;
  const finalTotal = total + shippingCost;

  const steps = [
    {
      title: 'Carrinho',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Endereço e Pagamento',
      icon: <EnvironmentOutlined />
    },
    {
      title: 'Confirmação',
      icon: <CheckCircleOutlined />
    }
  ];

  if (loading && currentStep === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px' 
    }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Finalizar Compra
      </Title>

      <Steps current={currentStep} style={{ marginBottom: '32px' }}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      <Row gutter={[24, 24]}>
        {/* Resumo do Pedido */}
        <Col xs={24} lg={8}>
          <Card title="Resumo do Pedido" style={{ position: 'sticky', top: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {items.map((item) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <Text strong>{item.product?.name || 'Produto'}</Text>
                    <br />
                    <Text type="secondary">Qtd: {item.quantity}</Text>
                  </div>
                  <Text strong>
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </Text>
                </div>
              ))}
              
              <Divider />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Subtotal:</Text>
                <Text>{formatPrice(total)}</Text>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Frete:</Text>
                <Text>{shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}</Text>
              </div>
              
              <Divider />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={4}>Total:</Title>
                <Title level={4} style={{ color: '#d4af37' }}>
                  {formatPrice(finalTotal)}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Formulário */}
        <Col xs={24} lg={16}>
          {currentStep === 1 && (
            <Card title="Dados de Entrega e Pagamento">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinishOrder}
                initialValues={{
                  state: 'SP'
                }}
              >
                <Title level={4}>Endereço de Entrega</Title>
                
                <Row gutter={16}>
                  <Col xs={24} sm={16}>
                    <Form.Item
                      name="street"
                      label="Rua"
                      rules={[{ required: true, message: 'Rua é obrigatória' }]}
                    >
                      <Input placeholder="Nome da rua" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="number"
                      label="Número"
                      rules={[{ required: true, message: 'Número é obrigatório' }]}
                    >
                      <Input placeholder="123" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="complement"
                  label="Complemento"
                >
                  <Input placeholder="Apartamento, bloco, etc." />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="neighborhood"
                      label="Bairro"
                      rules={[{ required: true, message: 'Bairro é obrigatório' }]}
                    >
                      <Input placeholder="Nome do bairro" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="city"
                      label="Cidade"
                      rules={[{ required: true, message: 'Cidade é obrigatória' }]}
                    >
                      <Input placeholder="Nome da cidade" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="state"
                      label="Estado"
                      rules={[{ required: true, message: 'Estado é obrigatório' }]}
                    >
                      <Input placeholder="SP" maxLength={2} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="zip_code"
                      label="CEP"
                      rules={[
                        { required: true, message: 'CEP é obrigatório' },
                        { pattern: /^\d{5}-?\d{3}$/, message: 'CEP inválido' }
                      ]}
                    >
                      <Input placeholder="12345-678" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Title level={4}>Forma de Pagamento</Title>
                
                <Radio.Group 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="pix">
                      <Space>
                        <QrcodeOutlined style={{ color: '#d4af37' }} />
                        <span>PIX - Aprovação instantânea</span>
                      </Space>
                    </Radio>
                    <Radio value="credit_card">
                      <Space>
                        <CreditCardOutlined style={{ color: '#d4af37' }} />
                        <span>Cartão de Crédito</span>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>

                <Divider />

                <Form.Item
                  name="notes"
                  label="Observações (opcional)"
                >
                  <Input.TextArea 
                    rows={3} 
                    placeholder="Alguma observação sobre o pedido..." 
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    loading={loading}
                    style={{ 
                      width: '100%',
                      backgroundColor: '#d4af37',
                      borderColor: '#d4af37',
                      height: '48px',
                      fontSize: '16px'
                    }}
                  >
                    Finalizar Pedido - {formatPrice(finalTotal)}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {currentStep === 2 && orderData && (
            <Card title="Pedido Criado com Sucesso!">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined 
                    style={{ fontSize: '64px', color: '#52c41a' }} 
                  />
                  <Title level={3} style={{ marginTop: '16px' }}>
                    Pedido #{orderData.orderNumber}
                  </Title>
                  <Text type="secondary">
                    Seu pedido foi criado com sucesso!
                  </Text>
                </div>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                  <Space direction="vertical" size="middle">
                    <Button 
                      type="primary"
                      size="large"
                      onClick={() => navigate(`/orders/${orderData.orderId}`)}
                      style={{ 
                        backgroundColor: '#d4af37',
                        borderColor: '#d4af37'
                      }}
                    >
                      Ver Detalhes do Pedido
                    </Button>
                    <Button 
                      size="large"
                      onClick={() => navigate('/')}
                    >
                      Continuar Comprando
                    </Button>
                  </Space>
                </div>
              </Space>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal PIX */}
      <Modal
        title="Pagamento via PIX"
        open={showPixModal}
        onCancel={() => setShowPixModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowPixModal(false)}>
            Cancelar
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            loading={loading}
            onClick={handleConfirmPayment}
            style={{ backgroundColor: '#d4af37', borderColor: '#d4af37' }}
          >
            Confirmar Pagamento
          </Button>
        ]}
        width={600}
      >
        {orderData?.pixData && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>
                Escaneie o QR Code ou copie o código PIX
              </Title>
              <Text type="secondary">
                Valor: {formatPrice(orderData.total)}
              </Text>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img 
                src={orderData.pixData.qrCode} 
                alt="QR Code PIX" 
                style={{ maxWidth: '200px', border: '1px solid #d9d9d9' }}
              />
            </div>

            <div>
              <Text strong>Código PIX:</Text>
              <Input.TextArea 
                value={orderData.pixData.code}
                readOnly
                rows={3}
                style={{ marginTop: '8px' }}
              />
            </div>

            <div style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
              padding: '12px'
            }}>
              <Text type="secondary">
                💡 Este é um ambiente de demonstração. 
                Clique em "Confirmar Pagamento" para simular a aprovação do PIX.
              </Text>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default Checkout;

