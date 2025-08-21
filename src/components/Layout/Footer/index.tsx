import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  InstagramOutlined,
  FacebookOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ 
      background: '#1a1a1a', 
      color: '#ffffff',
      padding: '48px 24px 24px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <Row gutter={[32, 32]}>
          {/* Informações da empresa */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#d4af37', marginBottom: '16px' }}>
              Emunah Gold 18K
            </Title>
            <Text style={{ color: '#cccccc', lineHeight: '1.6' }}>
              Especialistas em joias de ouro 18K com qualidade excepcional e 
              designs únicos. Tradição e elegância em cada peça.
            </Text>
            <div style={{ marginTop: '16px' }}>
              <Space size="middle">
                <Link 
                  href="https://instagram.com" 
                  target="_blank"
                  style={{ color: '#d4af37', fontSize: '20px' }}
                >
                  <InstagramOutlined />
                </Link>
                <Link 
                  href="https://facebook.com" 
                  target="_blank"
                  style={{ color: '#d4af37', fontSize: '20px' }}
                >
                  <FacebookOutlined />
                </Link>
                <Link 
                  href="https://wa.me/5511999999999" 
                  target="_blank"
                  style={{ color: '#d4af37', fontSize: '20px' }}
                >
                  <WhatsAppOutlined />
                </Link>
              </Space>
            </div>
          </Col>

          {/* Links úteis */}
          <Col xs={24} sm={12} md={8}>
            <Title level={5} style={{ color: '#ffffff', marginBottom: '16px' }}>
              Links Úteis
            </Title>
            <Space direction="vertical" size="small">
              <Link href="/products" style={{ color: '#cccccc' }}>
                Nossos Produtos
              </Link>
              <Link href="/about" style={{ color: '#cccccc' }}>
                Sobre Nós
              </Link>
              <Link href="/contact" style={{ color: '#cccccc' }}>
                Contato
              </Link>
              <Link href="/tracking" style={{ color: '#cccccc' }}>
                Rastrear Pedido
              </Link>
              <Link href="/terms" style={{ color: '#cccccc' }}>
                Termos de Uso
              </Link>
              <Link href="/privacy" style={{ color: '#cccccc' }}>
                Política de Privacidade
              </Link>
            </Space>
          </Col>

          {/* Contato */}
          <Col xs={24} sm={24} md={8}>
            <Title level={5} style={{ color: '#ffffff', marginBottom: '16px' }}>
              Contato
            </Title>
            <Space direction="vertical" size="middle">
              <Space>
                <PhoneOutlined style={{ color: '#d4af37' }} />
                <Text style={{ color: '#cccccc' }}>
                  (11) 99999-9999
                </Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#d4af37' }} />
                <Text style={{ color: '#cccccc' }}>
                  contato@emunah.com
                </Text>
              </Space>
              <Space align="start">
                <EnvironmentOutlined style={{ color: '#d4af37', marginTop: '4px' }} />
                <Text style={{ color: '#cccccc' }}>
                  Rua das Joias, 123<br />
                  Centro - São Paulo/SP<br />
                  CEP: 01234-567
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#333333', margin: '32px 0 16px' }} />

        {/* Copyright */}
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <Text style={{ color: '#888888' }}>
              © 2025 Emunah Gold 18K. Todos os direitos reservados.
            </Text>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
            <Space split={<span style={{ color: '#666666' }}>|</span>}>
              <Text style={{ color: '#888888' }}>
                Formas de Pagamento: Cartão de Crédito, PIX
              </Text>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;

