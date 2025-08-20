/**
 * Página de Login
 * Emunah Gold 18K - Frontend
 */

import React from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, CrownOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const { Title, Text, Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Redirecionar se já estiver logado
  if (user) {
    return <Navigate to="/" replace />;
  }

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
    //navigate('/');
    } catch (error) {
      console.log('erro',error)
      // Erro já tratado no contexto
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elementos decorativos de fundo */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      <Row justify="center" style={{ width: '100%', maxWidth: 1400, zIndex: 1 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10} xxl={8}>
          <Card
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1)',
              borderRadius: '20px',
              border: 'none',
              overflow: 'hidden'
            }}
          >
            {/* Header com gradiente */}
            <div style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
              margin: '-24px -24px 32px -24px',
              padding: '40px 24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v20h20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.1
              }} />
              
              <CrownOutlined 
                style={{ 
                  fontSize: '56px', 
                  color: '#fff',
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }} 
              />
              <Title 
                level={1} 
                style={{ 
                  margin: 0, 
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Emunah Gold 18K
              </Title>
              <Text 
                style={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '16px',
                  fontWeight: 400
                }}
              >
                Joias exclusivas em ouro 18K
              </Text>
            </div>

            <div style={{ padding: '0 8px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Title level={3} style={{ margin: 0, color: '#2c3e50', marginBottom: '8px' }}>
                  Acesse sua conta
                </Title>
                <Text type="secondary" style={{ fontSize: '15px' }}>
                  Entre com suas credenciais para continuar
                </Text>
              </div>

              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  label={<Text strong style={{ color: '#2c3e50' }}>Email</Text>}
                  rules={[
                    { required: true, message: 'Por favor, insira seu email!' },
                    { type: 'email', message: 'Email inválido!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#d4af37' }} />} 
                    placeholder="seu@email.com"
                    style={{ 
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '2px solid #f0f0f0',
                      fontSize: '16px'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<Text strong style={{ color: '#2c3e50' }}>Senha</Text>}
                  rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#d4af37' }} />}
                    placeholder="Sua senha"
                    style={{ 
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '2px solid #f0f0f0',
                      fontSize: '16px'
                    }}
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: '32px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    style={{
                      height: '56px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '18px',
                      boxShadow: '0 8px 16px rgba(212, 175, 55, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </Form.Item>
              </Form>

              <Divider style={{ margin: '32px 0' }}>
                <Text type="secondary">ou</Text>
              </Divider>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Text type="secondary" style={{ fontSize: '15px' }}>
                  Não tem uma conta?
                </Text>
                <br />
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#d4af37', 
                    fontWeight: 600,
                    fontSize: '16px',
                    textDecoration: 'none'
                  }}
                >
                  Criar conta gratuita
                </Link>
              </div>

              {/* Elementos de confiança */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '24px'
              }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SafetyOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    <Text style={{ fontSize: '14px', color: '#666' }}>
                      Seus dados estão seguros e protegidos
                    </Text>
                  </div>
                  <Text 
                    style={{ 
                      fontSize: '12px', 
                      color: '#999', 
                      textAlign: 'center',
                      display: 'block'
                    }}
                  >
                    Certificado SSL • Criptografia de ponta a ponta
                  </Text>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-input:focus,
        .ant-input-password:focus {
          border-color: #d4af37 !important;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important;
        }

        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(212, 175, 55, 0.4) !important;
        }

        @media (max-width: 576px) {
          .ant-card {
            margin: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;