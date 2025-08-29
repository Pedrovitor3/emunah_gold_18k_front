import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Upload,
  Button,
  Row,
  Col,
  message,
  Divider,
  Space,
  Tooltip,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type CategoryInterface from '../../../interface/CategoryInterface';
import { getCategories } from '../../../services/categoryService';
import CreateCategoryModal from '../ModalCategory';
const { Option } = Select;
const { TextArea } = Input;

interface CreateProductBody {
  category_id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  weight?: number;
  gold_purity?: string;
  stock_quantity?: number;
  is_active?: boolean;
  featured?: boolean;
}

interface CreateProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (product: any) => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [skuValidating, setSkuValidating] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCategories();
      form.resetFields();
      setFileList([]);
    }
  }, [visible, form]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      message.error('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (values: CreateProductBody) => {
    try {
      setLoading(true);

      // Preparar arquivos de imagem
      const imageFiles = fileList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);

      const imageUrls: string[] = [];

      // Upload das imagens (se houver)
      if (imageFiles.length > 0) {
        try {
          // TODO: Implementar upload de imagens
          // imageUrls = await uploadProductImages(imageFiles);
          console.log('Arquivos para upload:', imageFiles);
        } catch (error) {
          message.error('Erro no upload das imagens');
          return;
        }
      }

      // Preparar dados do produto
      const productData: CreateProductBody & { images?: any[] } = {
        ...values,
        images: imageUrls.map((url, index) => ({
          image_url: url,
          alt_text: `${values.name} - Imagem ${index + 1}`,
        })),
      };

      // TODO: Implementar criação de produto
      // const newProduct = await createProduct(productData);
      console.log('Dados do produto:', productData);

      // Simular sucesso por enquanto
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success('Produto criado com sucesso!');
      onSuccess(productData);
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      message.error(error.message || 'Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setCategoryModalVisible(false);
    onCancel();
  };

  const handleCreateCategory = () => {
    setCategoryModalVisible(true);
  };

  const handleCategorySuccess = (newCategory: any) => {
    // Adicionar nova categoria à lista
    setCategories((prev) => [newCategory, ...prev]);
    // Selecionar automaticamente a nova categoria
    form.setFieldValue('category_id', newCategory.id);
    setCategoryModalVisible(false);
    message.success('Categoria criada e selecionada!');
  };

  const handleCategoryCancel = () => {
    setCategoryModalVisible(false);
  };

  const handleSkuValidation = async (sku: string) => {
    if (!sku) return;

    setSkuValidating(true);
    try {
      // TODO: Implementar validação de SKU
      // const isAvailable = await validateSKU(sku);
      // if (!isAvailable) {
      //   form.setFields([{
      //     name: 'sku',
      //     errors: ['Este SKU já está em uso']
      //   }]);
      // }
      console.log('Validando SKU:', sku);
    } catch (error) {
      console.error('Erro ao validar SKU:', error);
    } finally {
      setSkuValidating(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Apenas arquivos de imagem são permitidos!');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Imagem deve ser menor que 2MB!');
      return false;
    }

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: UploadFile = {
        uid: Date.now().toString() + Math.random(),
        name: file.name,
        status: 'done',
        url: e.target?.result as string,
        // originFileObj: file,
      };
      setFileList((prev) => [...prev, newFile]);
    };
    reader.readAsDataURL(file);

    return false; // Previne upload automático
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const goldPurityOptions = ['18k', '14k', '10k', '24k', '22k', '16k', '12k', '9k'];

  return (
    <>
      <Modal
        title="Criar Novo Produto"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
        styles={{
          body: { maxHeight: '70vh', overflowY: 'auto' },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_active: true,
            featured: false,
            stock_quantity: 0,
          }}
        >
          <Row gutter={16}>
            {/* Informações Básicas */}
            <Col span={24}>
              <Divider orientation="left">Informações Básicas</Divider>
            </Col>

            <Col span={12}>
              <Form.Item
                name="name"
                label="Nome do Produto"
                rules={[
                  { required: true, message: 'Nome é obrigatório' },
                  { min: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
                ]}
              >
                <Input placeholder="Digite o nome do produto" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[
                  { required: true, message: 'SKU é obrigatório' },
                  {
                    pattern: /^[A-Za-z0-9-_]+$/,
                    message: 'SKU deve conter apenas letras, números, hífen e underscore',
                  },
                ]}
                hasFeedback
                validateStatus={skuValidating ? 'validating' : undefined}
              >
                <Input
                  placeholder="EX: PROD-001"
                  onBlur={(e) => handleSkuValidation(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="description" label="Descrição">
                <TextArea rows={4} placeholder="Descreva o produto..." showCount maxLength={500} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="category_id"
                label="Categoria"
                rules={[{ required: true, message: 'Categoria é obrigatória' }]}
              >
                <Space.Compact style={{ width: '100%' }}>
                  <Select
                    placeholder="Selecione uma categoria"
                    style={{ flex: 1 }}
                    notFoundContent="Nenhuma categoria encontrada"
                    // necessário para que o form consiga setar o valor corretamente
                    options={categories.map((category) => ({
                      label: (
                        <Space>
                          {category.name}
                          {category.is_active === false && (
                            <span style={{ color: '#ff4d4f', fontSize: '12px' }}>(Inativa)</span>
                          )}
                        </Space>
                      ),
                      value: category.id,
                    }))}
                  />
                  <Tooltip title="Criar nova categoria">
                    <Button
                      icon={<PlusOutlined />}
                      onClick={handleCreateCategory}
                      style={{
                        backgroundColor: '#52c41a',
                        borderColor: '#52c41a',
                        color: 'white',
                      }}
                    />
                  </Tooltip>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="price"
                label="Preço (R$)"
                rules={[
                  { required: true, message: 'Preço é obrigatório' },
                  { type: 'number', min: 0.01, message: 'Preço deve ser maior que 0' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  min={0}
                  precision={2}
                  formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={(value) => value!.replace(/R\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>

            {/* Especificações do Produto */}
            <Col span={24}>
              <Divider orientation="left">Especificações</Divider>
            </Col>

            <Col span={8}>
              <Form.Item name="weight" label="Peso (g)">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  min={0}
                  precision={2}
                  addonAfter="g"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="gold_purity" label="Pureza do Ouro">
                <Select placeholder="Selecione a pureza" allowClear>
                  {goldPurityOptions.map((purity) => (
                    <Option key={purity} value={purity}>
                      {purity}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="stock_quantity" label="Quantidade em Estoque">
                <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
              </Form.Item>
            </Col>

            {/* Configurações */}
            <Col span={24}>
              <Divider orientation="left">Configurações</Divider>
            </Col>

            <Col span={12}>
              <Form.Item name="is_active" label="Produto Ativo" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="featured" label="Produto em Destaque" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            {/* Imagens */}
            <Col span={24}>
              <Divider orientation="left">Imagens do Produto</Divider>
            </Col>

            <Col span={24}>
              <Form.Item
                name="images"
                label="Imagens"
                extra="Selecione até 5 imagens. Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB cada."
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={beforeUpload}
                  onRemove={handleRemove}
                  multiple
                  maxCount={5}
                  accept="image/*"
                >
                  {fileList.length >= 5 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* Footer com botões */}
          <Row justify="end" style={{ marginTop: 24 }}>
            <Col>
              <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: '#d4af37',
                  borderColor: '#d4af37',
                }}
              >
                {loading ? 'Criando...' : 'Criar Produto'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal para criar categoria */}
      <CreateCategoryModal
        visible={categoryModalVisible}
        onCancel={handleCategoryCancel}
        onSuccess={handleCategorySuccess}
      />
    </>
  );
};

export default CreateProductModal;
