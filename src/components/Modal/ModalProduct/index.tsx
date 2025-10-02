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
import { createProduct, updateProduct } from '../../../services/productService';
import type { ProductInterface } from '../../../interface/ProductInterface';
import type { RcFile } from 'antd/lib/upload';
import { uploadFileToBackend, uploadProductImages } from '../../../services/uploadService';

const { Option } = Select;
const { TextArea } = Input;

interface CreateProductBody {
  category: CategoryInterface;
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

interface ProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (product: any) => void;
  product?: ProductInterface | null;
}

interface UploadImageInput {
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  product = null,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [skuValidating, setSkuValidating] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  const isEditing = product ? true : false;
  const modalTitle = isEditing ? 'Editar Produto' : 'Criar Novo Produto';
  const submitButtonText = isEditing ? 'Atualizar Produto' : 'Criar Produto';
  const loadingText = isEditing ? 'Atualizando...' : 'Criando...';

  useEffect(() => {
    if (visible) {
      setFormInitialized(false);
      const initializeModal = async () => {
        try {
          await loadCategories();

          if (isEditing && product) {
            await populateForm(product);
          } else {
            form.resetFields();
            setFileList([]);
          }

          setFormInitialized(true);
        } catch (error) {
          console.error('Erro ao inicializar modal:', error);
          message.error('Erro ao carregar dados do modal');
        }
      };

      initializeModal();
    } else {
      setFormInitialized(false);
      form.resetFields();
      setFileList([]);
    }
  }, [visible, isEditing, product?.id]);

  const populateForm = async (productData: ProductInterface) => {
    const price =
      typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price;

    const weight =
      typeof productData.weight === 'string' ? parseFloat(productData.weight) : productData.weight;

    const stockQuantity =
      typeof productData.stock_quantity === 'string'
        ? parseInt(productData.stock_quantity, 10)
        : productData.stock_quantity;

    const formValues = {
      category_id: productData.category?.id || productData.category_id,
      name: productData.name || '',
      description: productData.description || '',
      sku: productData.sku || '',
      price: price || 0,
      weight: weight || null,
      gold_purity: productData.gold_purity || null,
      stock_quantity: stockQuantity || 0,
      is_active: productData.is_active ?? true,
      featured: productData.featured ?? false,
    };

    await new Promise((resolve) => setTimeout(resolve, 100));
    form.resetFields();
    await new Promise((resolve) => setTimeout(resolve, 50));
    form.setFieldsValue(formValues);

    // Carregar imagens existentes se houver
    if (productData.images && productData.images.length > 0) {
      const existingImages: UploadFile[] = productData.images.map((img, index) => ({
        uid: img.id ? `existing-${img.id}` : `existing-${index}`,
        name: img.alt_text || `Imagem ${index + 1}`,
        status: 'done',
        url: img.image_url,
        response: { url: img.image_url },
      }));
      setFileList(existingImages);
    } else {
      setFileList([]);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      message.error('Erro ao carregar categorias');
      throw error;
    }
  };

  // Função simplificada para beforeUpload
  const beforeUpload = (file: RcFile): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const isImage = allowedTypes.includes(file.type);

    if (!isImage) {
      message.error('Apenas arquivos de imagem são permitidos! (JPEG, PNG, WebP)');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Imagem deve ser menor que 5MB!');
      return false;
    }

    if (fileList.length >= 5) {
      message.error('Máximo de 5 imagens permitidas!');
      return false;
    }

    // Criar preview da imagem sem fazer upload
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: UploadFile = {
        uid: `new-${Date.now()}-${Math.random()}`,
        name: file.name,
        status: 'done',
        url: e.target?.result as string,
        originFileObj: file as RcFile,
      };
      setFileList((prev) => [...prev, newFile]);
    };
    reader.readAsDataURL(file);

    return false; // Previne upload automático do antd
  };

  const handleSubmit = async (values: CreateProductBody) => {
    try {
      setLoading(true);

      // Separar arquivos novos dos existentes
      const newImageFiles = fileList
        .filter((file) => file.originFileObj && !file.response?.url)
        .map((file) => file.originFileObj as File);

      const existingImages = fileList
        .filter((file) => file.response?.url || file.url)
        .map((file, index) => ({
          id: file.uid.startsWith('existing-') ? file.uid.replace('existing-', '') : undefined,
          image_url: file.response?.url || file.url || '',
          alt_text: file.name || `${values.name} - Imagem`,
          is_primary: index === 0,
          sort_order: index,
        }));

      let newImageUrls: string[] = [];

      // Upload das imagens novas se houver
      if (newImageFiles.length > 0) {
        try {
          const uploadMessageKey = message.loading('Iniciando upload das imagens...', 0);
          console.log('uploadMessageKey', uploadMessageKey);
          // Se for apenas 1 arquivo, usar rota single
          if (newImageFiles.length === 1) {
            const result = await uploadFileToBackend(newImageFiles[0], {
              folder: 'products',
              onProgress: (progress) => {
                setUploadProgress({
                  [newImageFiles[0].name]: progress.percentage,
                });
              },
            });
            newImageUrls = [result.url];
            // message.destroy(uploadMessageKey);
            message.success('Imagem enviada com sucesso!');
          } else {
            // Se forem múltiplos arquivos, usar rota de múltiplos uploads
            newImageUrls = await uploadProductImages(newImageFiles, values.name);
            // message.destroy(uploadMessageKey);
            message.success(`${newImageUrls.length} imagens enviadas com sucesso!`);
          }
        } catch (error) {
          message.destroy();
          console.error('Erro no upload das imagens:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Erro desconhecido no upload';
          message.error(`Erro no upload das imagens: ${errorMessage}`);
          setLoading(false);
          return;
        }
      }

      // Combinar imagens existentes com novas
      const allImages = [
        ...existingImages,
        ...newImageUrls.map((url, index) => ({
          image_url: url,
          alt_text: `${values.name} - Nova Imagem ${index + 1}`,
          order: existingImages.length + index + 1,
        })),
      ];

      // Preparar dados do produto
      const productData: CreateProductBody & { images?: any[] } = {
        ...values,
        images: allImages,
      };

      let result;

      if (isEditing && product) {
        result = await updateProduct(product.id!, values);
        message.success('Produto atualizado com sucesso!');
      } else {
        result = await createProduct(productData);
        message.success('Produto criado com sucesso!');
      }

      // Callback de sucesso
      onSuccess(result || values);
      handleCancel();
    } catch (error: any) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} produto:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      message.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} produto: ${errorMessage}`);
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setCategoryModalVisible(false);
    setFormInitialized(false);
    onCancel();
  };

  const handleCreateCategory = () => {
    setCategoryModalVisible(true);
  };

  const handleCategorySuccess = (newCategory: any) => {
    setCategories((prev) => [newCategory, ...prev]);
    form.setFieldValue('category_id', newCategory.id);
    setCategoryModalVisible(false);
    message.success('Categoria criada e selecionada!');
  };

  const handleCategoryCancel = () => {
    setCategoryModalVisible(false);
  };

  const handleSkuValidation = async (sku: string) => {
    if (!sku) return;

    if (isEditing && product && product.sku === sku) {
      return;
    }

    setSkuValidating(true);
    try {
      // TODO: Implementar validação de SKU
      console.log('Validando SKU:', sku);
    } catch (error) {
      console.error('Erro ao validar SKU:', error);
    } finally {
      setSkuValidating(false);
    }
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

  if (visible && !formInitialized) {
    return (
      <Modal
        title={modalTitle}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
      >
        <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        title={modalTitle}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
        destroyOnClose
        styles={{
          body: {
            maxHeight: '75vh',
            overflowY: 'auto',
            padding: '24px 16px',
          },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            {/* Informações Básicas */}
            <Divider orientation="left">Informações Básicas</Divider>

            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                <Form.Item
                  name="name"
                  label="Nome do Produto"
                  initialValue={form.getFieldValue('name')}
                  rules={[
                    { required: true, message: 'Nome é obrigatório' },
                    { min: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
                  ]}
                >
                  <Input placeholder="Digite o nome do produto" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={10} xl={10}>
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
                    disabled={isEditing}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                <Form.Item name="description" label="Descrição">
                  <TextArea
                    rows={4}
                    placeholder="Descreva o produto..."
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                <Form.Item
                  name="category_id"
                  label="Categoria"
                  initialValue={form.getFieldValue('category_id')}
                  rules={[{ required: true, message: 'Categoria é obrigatória' }]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      placeholder="Selecione uma categoria"
                      style={{ flex: 1 }}
                      showSearch
                      optionFilterProp="children"
                      value={form.getFieldValue('category_id')}
                      onChange={(value) => {
                        form.setFieldValue('category_id', value);
                      }}
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {categories.map((category) => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
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

              <Col xs={24} sm={24} md={12} lg={10} xl={10}>
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
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Especificações do Produto */}
            <Divider orientation="left">Especificações</Divider>

            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
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

              <Col xs={24} sm={12} md={8} lg={7} xl={7}>
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

              <Col xs={24} sm={12} md={8} lg={7} xl={7}>
                <Form.Item name="stock_quantity" label="Quantidade em Estoque">
                  <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
                </Form.Item>
              </Col>
            </Row>

            {/* Configurações */}
            <Divider orientation="left">Configurações</Divider>

            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={10} lg={10} xl={10}>
                <Form.Item name="is_active" label="Produto Ativo" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={10} lg={10} xl={10}>
                <Form.Item name="featured" label="Produto em Destaque" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            {/* Imagens */}
            <Divider orientation="left">Imagens do Produto</Divider>

            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                <Form.Item
                  name="images"
                  label="Imagens"
                  extra="Selecione até 5 imagens. Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 5MB cada."
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
            <Row justify="end" style={{ marginTop: 32 }}>
              <Col xs={24} sm={16} md={12} lg={10} xl={8}>
                <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                  <Button onClick={handleCancel}>Cancelar</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      backgroundColor: '#d4af37',
                      borderColor: '#d4af37',
                    }}
                  >
                    {loading ? loadingText : submitButtonText}
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
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

export default ProductModal;
