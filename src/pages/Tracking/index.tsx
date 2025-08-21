
import React, { useState } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Timeline, 
  message,
  Spin,
  Empty,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { getTrackingInfo } from '../../services/trackingService';

const { Title, Text } = Typography;

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  occurred_at: string;
}

interface TrackingInfo {
  order_number: string;
  tracking_code: string;
  status: string;
  recipient: string;
  shipping_address: any;
  events: TrackingEvent[];
}

const Tracking: React.FC = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      message.warning('Digite o código de rastreamento');
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      const response = await getTrackingInfo(trackingCode.trim());
      setTrackingInfo(response);
    } catch (error: any) {
      message.error(error.message || 'Código de rastreamento não encontrado');
      setTrackingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('confirmado') || statusLower.includes('preparação')) {
      return <ClockCircleOutlined style={{ color: '#faad14' }} />;
    }
    if (statusLower.includes('enviado') || statusLower.includes('trânsito')) {
      return <TruckOutlined style={{ color: '#1890ff' }} />;
    }
    if (statusLower.includes('entrega') || statusLower.includes('entregue')) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
    
    return <EnvironmentOutlined style={{ color: '#d4af37' }} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: any) => {
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address);
      } catch {
        return address;
      }
    }
    
    return `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''} - ${address.neighborhood}, ${address.city}/${address.state} - CEP: ${address.zip_code}`;
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '24px' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2}>Rastreamento de Pedidos</Title>
        <Text type="secondary">
          Digite o código de rastreamento para acompanhar seu pedido
        </Text>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Digite o código de rastreamento (ex: BR123456789)"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            onPressEnter={handleSearch}
            size="large"
            style={{ fontSize: '16px' }}
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
            size="large"
            style={{ 
              backgroundColor: '#d4af37',
              borderColor: '#d4af37'
            }}
          >
            Rastrear
          </Button>
        </Space.Compact>
      </Card>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px' 
        }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>Buscando informações do pedido...</Text>
          </div>
        </div>
      )}

      {!loading && searched && !trackingInfo && (
        <Card>
          <Empty
            description="Código de rastreamento não encontrado"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Text type="secondary">
              Verifique se o código foi digitado corretamente ou entre em contato conosco.
            </Text>
          </Empty>
        </Card>
      )}

      {!loading && trackingInfo && (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Informações do Pedido */}
          <Card title="Informações do Pedido">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Pedido: </Text>
                <Text>{trackingInfo.order_number}</Text>
              </div>
              
              <div>
                <Text strong>Código de Rastreamento: </Text>
                <Text code>{trackingInfo.tracking_code}</Text>
              </div>
              
              <div>
                <Text strong>Destinatário: </Text>
                <Text>{trackingInfo.recipient}</Text>
              </div>
              
              <div>
                <Text strong>Endereço de Entrega: </Text>
                <Text>{formatAddress(trackingInfo.shipping_address)}</Text>
              </div>
            </Space>
          </Card>

          {/* Timeline de Rastreamento */}
          <Card title="Histórico de Rastreamento">
            {trackingInfo.events.length > 0 ? (
              <Timeline mode="left">
                {trackingInfo.events.map((event, index) => (
                  <Timeline.Item
                    key={event.id || index}
                    dot={getStatusIcon(event.status)}
                    color={index === 0 ? '#d4af37' : undefined}
                  >
                    <div style={{ paddingBottom: '16px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong style={{ fontSize: '16px' }}>
                          {event.status}
                        </Text>
                      </div>
                      
                      <div style={{ marginBottom: '4px' }}>
                        <Text>{event.description}</Text>
                      </div>
                      
                      <div style={{ marginBottom: '4px' }}>
                        <EnvironmentOutlined style={{ marginRight: '4px', color: '#666' }} />
                        <Text type="secondary">{event.location}</Text>
                      </div>
                      
                      <div>
                        <ClockCircleOutlined style={{ marginRight: '4px', color: '#666' }} />
                        <Text type="secondary">
                          {formatDate(event.occurred_at)}
                        </Text>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Empty
                description="Nenhum evento de rastreamento encontrado"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Title level={4}>Precisa de Ajuda?</Title>
              
              <Text>
                Se você tiver dúvidas sobre seu pedido ou rastreamento, 
                entre em contato conosco:
              </Text>
              
              <Divider />
              
              <Space direction="vertical">
                <Text>
                  📞 <strong>Telefone:</strong> (11) 99999-9999
                </Text>
                <Text>
                  📧 <strong>Email:</strong> contato@emunah.com
                </Text>
                <Text>
                  💬 <strong>WhatsApp:</strong> (11) 99999-9999
                </Text>
              </Space>
              
              <Divider />
              
              <Text type="secondary" style={{ fontSize: '12px' }}>
                * Os prazos de entrega podem variar conforme a localidade e condições climáticas.
                <br />
                * Para pedidos com pagamento via PIX, o prazo de entrega inicia após a confirmação do pagamento.
              </Text>
            </Space>
          </Card>
        </Space>
      )}
    </div>
  );
};

export default Tracking;

