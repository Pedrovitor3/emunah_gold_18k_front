import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  Switch,
  Select,
  Typography,
  Divider,
  Space,
  Badge,
  Tabs,
  Statistic,
  Progress,
  List,
  Tag,
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CrownOutlined,
  GiftOutlined,
  StarFilled,
  ShoppingCartOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Mock user data
  const userData = {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    memberSince: '2020-01-15',
    totalOrders: 47,
    totalSpent: 25499.90,
    loyaltyPoints: 2547,
    level: 'Gold',
    preferences: {
      notifications: true,
      newsletter: true,
      sms: false,
    },
  };

  const recentOrders = [
    { id: '#001', date: '2024-08-15', total: 1299.90, status: 'Entregue' },
    { id: '#002', date: '2024-08-10', total: 899.90, status: 'A caminho' },
    { id: '#003', date: '2024-08-05', total: 2499.90, status: 'Processando' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleSave = async (values: any) => {
    console.log('Saving profile:', values);
    setIsEditing(false);
    // Implementar lógica de salvamento
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Entregue': 'success',
      'A caminho': 'processing',
      'Processando': 'warning',
      'Cancelado': 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Bronze': '#CD7F32',
      'Silver': '#C0C0C0',
      'Gold': '#d4af37',
      'Platinum': '#E5E4E2',
    };
    return colors[level as keyof typeof colors] || '#d4af37';
  };

  return (
    <div style={{ padding: '24px 0', background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1a1a1a', marginBottom: 8 }}>
            Meu Perfil
          </Title>
          <Paragraph style={{ color: '#666', fontSize: 16 }}>
            Gerencie suas informações pessoais e preferências
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Profile Summary */}
          <Col xs={24} lg={8}>
            <Card
              style={{
                borderRadius: 16,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                textAlign: 'center',
              }}
              bodyStyle={{ padding: 32 }}
            >
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                <Avatar
                  size={120}
                  src={userData.avatar}
                  icon={<UserOutlined />}
                  style={{ border: '4px solid #d4af37' }}
                />
                <Button
                  shape="circle"
                  icon={<CameraOutlined />}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#d4af37',
                    borderColor: '#d4af37',
                    color: 'white',
                  }}
                />
              </div>

              <Title level={4} style={{ marginBottom: 8 }}>
                {userData.name}
              </Title>

              <Space direction="vertical" align="center" style={{ marginBottom: 24 }}>
                <Badge
                  count={
                    <CrownOutlined style={{ color: getLevelColor(userData.level) }} />
                  }
                >
                  <Tag
                    color={getLevelColor(userData.level)}
                    style={{ fontSize: 14, padding: '4px 12px', fontWeight: 500 }}
                  >
                    Membro {userData.level}
                  </Tag>
                </Badge>
                <Text style={{ color: '#666', fontSize: 13 }}>
                  Membro desde {new Date(userData.memberSince).toLocaleDateString('pt-BR')}
                </Text>
              </Space>

              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                  <Statistic
                    title="Pedidos"
                    value={userData.totalOrders}
                    valueStyle={{ color: '#d4af37', fontSize: 20, fontWeight: 600 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Pontos"
                    value={userData.loyaltyPoints}
                    valueStyle={{ color: '#d4af37', fontSize: 20, fontWeight: 600 }}
                    suffix={<StarFilled />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Gasto Total"
                    value={userData.totalSpent}
                    precision={2}
                    prefix="R$"
                    valueStyle={{ color: '#d4af37', fontSize: 14, fontWeight: 600 }}
                  />
                </Col>
              </Row>

              <Progress
                percent={75}
                strokeColor="#d4af37"
                trailColor="#f5f5f5"
                format={() => 'Próximo nível: Platinum'}
                style={{ marginBottom: 16 }}
              />

              <Button
                type="primary"
                icon={<GiftOutlined />}
                style={{
                  background: '#d4af37',
                  borderColor: '#d4af37',
                  borderRadius: 8,
                  fontWeight: 500,
                  width: '100%',
                }}
              >
                Resgatar Pontos
              </Button>
            </Card>
          </Col>

          {/* Profile Details */}
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: 16,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              bodyStyle={{ padding: '24px 32px' }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ marginTop: -8 }}
                items={[
                  {
                    key: '1',
                    label: 'Informações Pessoais',
                    children: (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                          <Title level={4} style={{ margin: 0 }}>
                            Dados Pessoais
                          </Title>
                          <Button
                            type={isEditing ? 'primary' : 'default'}
                            icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                            onClick={() => {
                              if (isEditing) {
                                form.submit();
                              } else {
                                setIsEditing(true);
                              }
                            }}
                            style={{
                              borderRadius: 8,
                              background: isEditing ? '#d4af37' : undefined,
                              borderColor: isEditing ? '#d4af37' : undefined,
                            }}
                          >
                            {isEditing ? 'Salvar' : 'Editar'}
                          </Button>
                        </div>

                        <Form
                          form={form}
                          layout="vertical"
                          initialValues={userData}
                          onFinish={handleSave}
                          disabled={!isEditing}
                        >
                          <Row gutter={16}>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                label="Nome Completo"
                                name="name"
                                rules={[{ required: true, message: 'Nome é obrigatório' }]}
                              >
                                <Input
                                  prefix={<UserOutlined />}
                                  style={{ borderRadius: 8 }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                label="E-mail"
                                name="email"
                                rules={[
                                  { required: true, message: 'E-mail é obrigatório' },
                                  { type: 'email', message: 'E-mail inválido' }
                                ]}
                              >
                                <Input
                                  prefix={<MailOutlined />}
                                  style={{ borderRadius: 8 }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                label="Telefone"
                                name="phone"
                                rules={[{ required: true, message: 'Telefone é obrigatório' }]}
                              >
                                <Input
                                  prefix={<PhoneOutlined />}
                                  style={{ borderRadius: 8 }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item label="CEP" name={['address', 'zipCode']}>
                                <Input style={{ borderRadius: 8 }} />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col xs={24} sm={16}>
                              <Form.Item label="Endereço" name={['address', 'street']}>
                                <Input
                                  prefix={<HomeOutlined />}
                                  style={{ borderRadius: 8 }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                              <Form.Item label="Estado" name={['address', 'state']}>
                                <Select style={{ width: '100%' }}>
                                  <Option value="SP">São Paulo</Option>
                                  <Option value="RJ">Rio de Janeiro</Option>
                                  <Option value="MG">Minas Gerais</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: 'Preferências',
                    children: (
                      <div>
                        <Title level={4} style={{ marginBottom: 24 }}>
                          Configurações de Notificação
                        </Title>

                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <Text strong>Notificações por E-mail</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                Receba atualizações sobre pedidos e promoções
                              </Text>
                            </div>
                            <Switch
                              defaultChecked={userData.preferences.notifications}
                              checkedChildren="Ativo"
                              unCheckedChildren="Inativo"
                            />
                          </div>

                          <Divider style={{ margin: '12px 0' }} />

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <Text strong>Newsletter</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                Receba ofertas exclusivas e novidades
                              </Text>
                            </div>
                            <Switch
                              defaultChecked={userData.preferences.newsletter}
                              checkedChildren="Ativo"
                              unCheckedChildren="Inativo"
                            />
                          </div>

                          <Divider style={{ margin: '12px 0' }} />

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <Text strong>SMS</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                Notificações importantes via SMS
                              </Text>
                            </div>
                            <Switch
                              defaultChecked={userData.preferences.sms}
                              checkedChildren="Ativo"
                              unCheckedChildren="Inativo"
                            />
                          </div>
                        </Space>
                      </div>
                    ),
                  },
                  {
                    key: '3',
                    label: 'Pedidos Recentes',
                    children: (
                      <div>
                        <Title level={4} style={{ marginBottom: 24 }}>
                          Últimos Pedidos
                        </Title>

                        <List
                          itemLayout="horizontal"
                          dataSource={recentOrders}
                          renderItem={(order) => (
                            <List.Item
                              style={{
                                padding: '16px 0',
                                border: 'none',
                                borderBottom: '1px solid #f0f0f0',
                              }}
                              actions={[
                                <Button
                                  type="link"
                                  style={{ color: '#d4af37', padding: 0 }}
                                >
                                  Ver Detalhes
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    icon={<ShoppingCartOutlined />}
                                    style={{ background: '#d4af37' }}
                                  />
                                }
                                title={
                                  <Space>
                                    <Text strong>Pedido {order.id}</Text>
                                    <Tag color={getStatusColor(order.status)}>
                                      {order.status}
                                    </Tag>
                                  </Space>
                                }
                                description={
                                  <Space direction="vertical" size={4}>
                                    <Text type="secondary">
                                      {new Date(order.date).toLocaleDateString('pt-BR')}
                                    </Text>
                                    <Text strong style={{ color: '#d4af37' }}>
                                      {formatPrice(order.total)}
                                    </Text>
                                  </Space>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;