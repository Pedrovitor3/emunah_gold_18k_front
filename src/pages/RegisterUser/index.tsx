

import React from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CrownOutlined } from '@ant-design/icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { RegisterData } from '../../types';


const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const { register, loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  if (user) {
    return <Navigate to="/" replace />;
  }

  const onFinish = async (values: RegisterData & { confirmPassword: string }) => {
    try {
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      navigate('/');
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: 1200 }}>
        <Col xs={24} sm={20} md={18} lg={14} xl={10}>
          <Card
            style={{
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              borderRadius: '12px',
              border: 'none'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <CrownOutlined 
                style={{ 
                  fontSize: '48px', 
                  color: '#d4af37',
                  marginBottom: '16px'
                }} 
              />
              <Title level={2} style={{ margin: 0, color: '#2c3e50' }}>
                Emunah Gold 18K
              </Title>
              <Text type="secondary">
                Crie sua conta e faça parte da nossa família
              </Text>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="first_name"
                    label="Nome"
                    rules={[
                      { required: true, message: 'Por favor, insira seu nome!' },
                      { min: 2, message: 'Nome deve ter pelo menos 2 caracteres!' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Seu nome"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="last_name"
                    label="Sobrenome"
                    rules={[
                      { required: true, message: 'Por favor, insira seu sobrenome!' },
                      { min: 2, message: 'Sobrenome deve ter pelo menos 2 caracteres!' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Seu sobrenome"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Por favor, insira seu email!' },
                  { type: 'email', message: 'Email inválido!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="seu@email.com"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Telefone (Opcional)"
                rules={[
                  { pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Formato: (11) 99999-9999' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="(11) 99999-9999"
                  style={{ borderRadius: '8px' }}
                  maxLength={15}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="password"
                    label="Senha"
                    rules={[
                      { required: true, message: 'Por favor, insira sua senha!' },
                      { min: 6, message: 'Senha deve ter pelo menos 6 caracteres!' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Sua senha"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirmar Senha"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Por favor, confirme sua senha!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('As senhas não coincidem!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Confirme sua senha"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '16px'
                  }}
                >
                  Criar Conta
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                Já tem uma conta?{' '}
                <Link to="/login" style={{ color: '#d4af37', fontWeight: 500 }}>
                  Faça login aqui
                </Link>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;