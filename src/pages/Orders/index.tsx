import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Steps,
  Timeline,
  Image,
  Divider,
  Input,
  Select,
  DatePicker,
  Empty,
  Modal,
  Rate,
  Form,
  message,
  Badge,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  DownloadOutlined,
  RedoOutlined,
  StarOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PauseOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// Mock data para pedidos
const mockOrders = [
  {
    id: '001',
    orderNumber: '#PED-2024-001',
    date: '2024-08-15',
    status: 'delivered',
    total: 7999.9,
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        image: 'https://images.unsplash.com/photo-1696446702061-95c0d5ae964e?w=100',
        quantity: 1,
        price: 7999.9,
      },
    ],
    shipping: {
      address: 'Rua das Flores, 123 - São Paulo, SP',
      method: 'Expressa',
      tracking: 'BR123456789',
    },
    timeline: [
      { status: 'Pedido confirmado', date: '2024-08-15 10:30', completed: true },
      { status: 'Em preparação', date: '2024-08-15 14:20', completed: true },
      { status: 'Enviado', date: '2024-08-16 09:15', completed: true },
      { status: 'Em trânsito', date: '2024-08-17 16:45', completed: true },
      { status: 'Entregue', date: '2024-08-18 11:20', completed: true },
    ],
  },
  {
    id: '002',
    orderNumber: '#PED-2024-002',
    date: '2024-08-10',
    status: 'shipped',
    total: 3799.8,
    items: [
      {
        id: 2,
        name: 'AirPods Pro 2ª Geração',
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100',
        quantity: 2,
        price: 1899.9,
      },
    ],
    shipping: {
      address: 'Av. Paulista, 456 - São Paulo, SP',
      method: 'Padrão',
      tracking: 'BR987654321',
    },
    timeline: [
      { status: 'Pedido confirmado', date: '2024-08-10 15:45', completed: true },
      { status: 'Em preparação', date: '2024-08-11 08:30', completed: true },
      { status: 'Enviado', date: '2024-08-12 10:15', completed: true },
      { status: 'Em trânsito', date: '2024-08-13 14:20', completed: false },
      { status: 'Entregue', date: '', completed: false },
    ],
  },
  {
    id: '003',
    orderNumber: '#PED-2024-003',
    date: '2024-08-05',
    status: 'processing',
    total: 9999.9,
    items: [
      {
        id: 3,
        name: 'MacBook Air M3',
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100',
        quantity: 1,
        price: 9999.9,
      },
    ],
    shipping: {
      address: 'Rua Augusta, 789 - São Paulo, SP',
      method: 'Expressa',
      tracking: '',
    },
    timeline: [
      { status: 'Pedido confirmado', date: '2024-08-05 16:20', completed: true },
      { status: 'Em preparação', date: '2024-08-06 09:10', completed: false },
      { status: 'Enviado', date: '', completed: false },
      { status: 'Em trânsito', date: '', completed: false },
      { status: 'Entregue', date: '', completed: false },
    ],
  },
];

const OrdersPage: React.FC = () => {
  const [orders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  const statusConfig = {
    processing: { color: 'processing', label: 'Processando', icon: <ClockCircleOutlined /> },
    shipped: { color: 'warning', label: 'Enviado', icon: <TruckOutlined /> },
    delivered: { color: 'success', label: 'Entregue', icon: <CheckCircleOutlined /> },
    cancelled: { color: 'error', label: 'Cancelado', icon: <ExclamationCircleOutlined /> },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  const handleOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };

  const handleReorder = (order: any) => {
    message.success('Itens adicionados ao carrinho!');
  };

  const handleReview = (order: any) => {
    setSelectedOrder(order);
    setReviewModalVisible(true);
  };

  const submitReview = (values: any) => {
    console.log('Review submitted:', values);
    message.success('Avaliação enviada com sucesso!');
    setReviewModalVisible(false);
    reviewForm.resetFields();
  };

  const OrderCard: React.FC<{ order: any }> = ({ order }) => {
    const status = statusConfig[order.status as keyof typeof statusConfig];

    return (
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 12,
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={4}>
              <Text strong style={{ fontSize: 16 }}>
                {order.orderNumber}
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {formatDate(order.date)}
              </Text>
              <Tag color={status.color} icon={status.icon}>
                {status.label}
              </Tag>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text style={{ fontSize: 13, color: '#666' }}>Itens:</Text>
              {order.items.map((item: any, index: number) => (
                <Space key={index} size={8}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={32}
                    height={32}
                    style={{ borderRadius: 4 }}
                    preview={false}
                  />
                  <Text style={{ fontSize: 13 }}>
                    {item.name} (x{item.quantity})
                  </Text>
                </Space>
              ))}
            </Space>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Space direction="vertical" size={4} align="end">
              <Text style={{ fontSize: 13, color: '#666' }}>Total:</Text>
              <Text strong style={{ fontSize: 16, color: '#d4af37' }}>
                {formatPrice(order.total)}
              </Text>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleOrderDetails(order)}
                style={{
                  background: '#d4af37',
                  borderColor: '#d4af37',
                  borderRadius: 6,
                  width: '100%',
                }}
              >
                Detalhes
              </Button>

              <Space size={4} style={{ width: '100%' }}>
                <Tooltip title="Comprar novamente">
                  <Button
                    size="small"
                    icon={<RedoOutlined />}
                    onClick={() => handleReorder(order)}
                    style={{ borderRadius: 6, flex: 1 }}
                  />
                </Tooltip>

                {order.status === 'delivered' && (
                  <Tooltip title="Avaliar">
                    <Button
                      size="small"
                      icon={<StarOutlined />}
                      onClick={() => handleReview(order)}
                      style={{ borderRadius: 6, flex: 1 }}
                    />
                  </Tooltip>
                )}

                <Tooltip title="Baixar nota">
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    style={{ borderRadius: 6, flex: 1 }}
                  />
                </Tooltip>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px 0', background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1a1a1a', marginBottom: 8 }}>
            Meus Pedidos
          </Title>
          <Paragraph style={{ color: '#666', fontSize: 16 }}>
            Acompanhe o status dos seus pedidos e histórico de compras
          </Paragraph>
        </div>

        {/* Filters */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 12,
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Buscar por número do pedido..."
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Status"
                style={{ width: '100%' }}
                allowClear
                suffixIcon={<FilterOutlined />}
              >
                <Option value="processing">Processando</Option>
                <Option value="shipped">Enviado</Option>
                <Option value="delivered">Entregue</Option>
                <Option value="cancelled">Cancelado</Option>
              </Select>
            </Col>
            <Col xs={24} sm={10}>
              <RangePicker
                style={{ width: '100%', borderRadius: 8 }}
                placeholder={['Data inicial', 'Data final']}
                format="DD/MM/YYYY"
              />
            </Col>
          </Row>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
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
              image={<PauseOutlined style={{ fontSize: 64, color: '#d4af37' }} />}
              description={
                <Space direction="vertical" size="middle">
                  <Title level={4} style={{ color: '#666', margin: 0 }}>
                    Nenhum pedido encontrado
                  </Title>
                  <Paragraph style={{ color: '#999', margin: 0 }}>
                    Você ainda não fez nenhum pedido
                  </Paragraph>
                </Space>
              }
            >
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                style={{
                  background: '#d4af37',
                  borderColor: '#d4af37',
                  borderRadius: 8,
                  fontWeight: 500,
                  marginTop: 16,
                }}
              >
                Começar a Comprar
              </Button>
            </Empty>
          </Card>
        )}

        {/* Order Details Modal */}
        <Modal
          title={
            <Space>
              <PauseOutlined style={{ color: '#d4af37' }} />
              <span>Detalhes do Pedido</span>
            </Space>
          }
          open={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          {selectedOrder && (
            <div>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card title="Informações do Pedido" size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Space direction="vertical" size={4}>
                          <Text strong>Número do Pedido:</Text>
                          <Text>{selectedOrder.orderNumber}</Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space direction="vertical" size={4}>
                          <Text strong>Data do Pedido:</Text>
                          <Text>{formatDate(selectedOrder.date)}</Text>
                        </Space>
                      </Col>
                    </Row>

                    <Divider style={{ margin: '12px 0' }} />

                    <Row gutter={16}>
                      <Col span={12}>
                        <Space direction="vertical" size={4}>
                          <Text strong>Status:</Text>
                          <Tag
                            color={
                              statusConfig[selectedOrder.status as keyof typeof statusConfig].color
                            }
                          >
                            {statusConfig[selectedOrder.status as keyof typeof statusConfig].label}
                          </Tag>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space direction="vertical" size={4}>
                          <Text strong>Total:</Text>
                          <Text style={{ fontSize: 16, color: '#d4af37', fontWeight: 600 }}>
                            {formatPrice(selectedOrder.total)}
                          </Text>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card title="Itens do Pedido" size="small" style={{ marginBottom: 16 }}>
                    {selectedOrder.items.map((item: any, index: number) => (
                      <Row key={index} gutter={16} align="middle" style={{ marginBottom: 12 }}>
                        <Col span={4}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            style={{ borderRadius: 6 }}
                            preview={false}
                          />
                        </Col>
                        <Col span={12}>
                          <Space direction="vertical" size={2}>
                            <Text strong>{item.name}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Quantidade: {item.quantity}
                            </Text>
                          </Space>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                          <Text strong style={{ color: '#d4af37' }}>
                            {formatPrice(item.price)}
                          </Text>
                        </Col>
                      </Row>
                    ))}
                  </Card>
                </Col>

                <Col span={24}>
                  <Card title="Endereço de Entrega" size="small" style={{ marginBottom: 16 }}>
                    <Space direction="vertical" size={8}>
                      <Text>{selectedOrder.shipping.address}</Text>
                      <Text>Método: {selectedOrder.shipping.method}</Text>
                      {selectedOrder.shipping.tracking && (
                        <Space>
                          <Text>Código de rastreamento:</Text>
                          <Tag color="blue">{selectedOrder.shipping.tracking}</Tag>
                        </Space>
                      )}
                    </Space>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card title="Acompanhamento" size="small">
                    <Timeline
                      items={selectedOrder.timeline.map((step: any, index: number) => ({
                        color: step.completed ? '#d4af37' : '#d9d9d9',
                        children: (
                          <Space direction="vertical" size={2}>
                            <Text strong={step.completed}>{step.status}</Text>
                            {step.date && (
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {dayjs(step.date).format('DD/MM/YYYY HH:mm')}
                              </Text>
                            )}
                          </Space>
                        ),
                      }))}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal>

        {/* Review Modal */}
        <Modal
          title={
            <Space>
              <StarOutlined style={{ color: '#d4af37' }} />
              <span>Avaliar Produto</span>
            </Space>
          }
          open={reviewModalVisible}
          onCancel={() => {
            setReviewModalVisible(false);
            reviewForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          {selectedOrder && (
            <Form form={reviewForm} layout="vertical" onFinish={submitReview}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {selectedOrder.items.map((item: any, index: number) => (
                  <Card key={index} size="small" style={{ backgroundColor: '#fafafa' }}>
                    <Row gutter={12} align="middle">
                      <Col span={6}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          style={{ borderRadius: 4 }}
                          preview={false}
                        />
                      </Col>
                      <Col span={18}>
                        <Text strong style={{ fontSize: 14 }}>
                          {item.name}
                        </Text>
                      </Col>
                    </Row>

                    <Divider style={{ margin: '12px 0' }} />

                    <Form.Item
                      label="Avaliação"
                      name={`rating_${item.id}`}
                      rules={[{ required: true, message: 'Por favor, dê uma nota' }]}
                    >
                      <Rate style={{ color: '#d4af37' }} />
                    </Form.Item>

                    <Form.Item label="Comentário" name={`comment_${item.id}`}>
                      <TextArea
                        rows={3}
                        placeholder="Conte-nos sobre sua experiência com este produto..."
                        style={{ borderRadius: 6 }}
                      />
                    </Form.Item>
                  </Card>
                ))}

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  style={{
                    background: '#d4af37',
                    borderColor: '#d4af37',
                    borderRadius: 8,
                    fontWeight: 500,
                  }}
                >
                  Enviar Avaliação
                </Button>
              </Space>
            </Form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrdersPage;
