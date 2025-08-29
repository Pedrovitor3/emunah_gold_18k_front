import React, { useState } from 'react';
import { Modal, Form, Input, Switch, Button, Row, Col, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createCategory } from '../../../services/categoryService';

const { TextArea } = Input;

interface CreateCategoryBody {
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

interface CreateCategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (category: any) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [slugValidating, setSlugValidating] = useState(false);

  const handleSubmit = async (values: CreateCategoryBody) => {
    try {
      setLoading(true);

      const { name, slug, description, is_active } = values;
      // TODO: Implementar criação de categoria
      const newCategory = await createCategory(name, slug, description, is_active);

      // Simulação da API por enquanto
      const categoryData = {
        id: Date.now().toString(),
        ...values,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Dados da categoria:', categoryData);

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 800));

      message.success('Categoria criada com sucesso!');
      onSuccess(categoryData);
      form.resetFields();
      setAutoSlug(true);
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      message.error(error.message || 'Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAutoSlug(true);
    setSlugValidating(false);
    onCancel();
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, ''); // Remove hífens do início e fim
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    if (autoSlug && name) {
      const slug = generateSlug(name);
      form.setFieldValue('slug', slug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false);
    const slug = e.target.value;

    // TODO: Implementar validação de slug
    // setTimeout(() => handleSlugValidation(slug), 500);
  };

  const handleSlugValidation = async (slug: string) => {
    if (!slug || autoSlug) return;

    setSlugValidating(true);
    try {
      // TODO: Implementar validação de slug
      // const isAvailable = await validateCategorySlug(slug);
      // if (!isAvailable) {
      //   form.setFields([{
      //     name: 'slug',
      //     errors: ['Este slug já está em uso']
      //   }]);
      // }
      console.log('Validando slug:', slug);
    } catch (error) {
      console.error('Erro ao validar slug:', error);
    } finally {
      setSlugValidating(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined />
          Nova Categoria
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          is_active: true,
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Nome da Categoria"
              rules={[
                { required: true, message: 'Nome é obrigatório' },
                { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
                { max: 100, message: 'Nome deve ter no máximo 100 caracteres' },
              ]}
            >
              <Input placeholder="Digite o nome da categoria" onChange={handleNameChange} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="slug"
              label={
                <Space>
                  Slug
                  <span style={{ fontSize: '12px', color: '#666' }}>(usado na URL)</span>
                </Space>
              }
              rules={[
                { required: true, message: 'Slug é obrigatório' },
                {
                  pattern: /^[a-z0-9-]+$/,
                  message: 'Slug deve conter apenas letras minúsculas, números e hífens',
                },
              ]}
              extra={
                autoSlug
                  ? 'Slug gerado automaticamente baseado no nome'
                  : 'Slug personalizado (edite conforme necessário)'
              }
              hasFeedback
              validateStatus={slugValidating ? 'validating' : undefined}
            >
              <Input placeholder="categoria-exemplo" onChange={handleSlugChange} addonBefore="/" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Descrição">
              <TextArea
                rows={4}
                placeholder="Descreva a categoria... (opcional)"
                showCount
                maxLength={300}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="is_active" label="Categoria Ativa" valuePropName="checked">
              <Switch checkedChildren="Ativa" unCheckedChildren="Inativa" />
            </Form.Item>
          </Col>
        </Row>

        {/* Footer com botões */}
        <Row
          justify="end"
          style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}
        >
          <Col>
            <Space>
              <Button onClick={handleCancel}>Cancelar</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                }}
              >
                {loading ? 'Criando...' : 'Criar Categoria'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateCategoryModal;
