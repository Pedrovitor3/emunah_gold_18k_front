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
  product?: ProductInterface | null; // Produto para edição (null/undefined para criação)
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
  const [skuValidating, setSkuValidating] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const isEditing = product ? true : false;
  const modalTitle = isEditing ? 'Editar Produto' : 'Criar Novo Produto';
  const submitButtonText = isEditing ? 'Atualizar Produto' : 'Criar Produto';
  const loadingText = isEditing ? 'Atualizando...' : 'Criando...';

  useEffect(() => {
    if (visible) {
      const initializeModal = async () => {
        // Primeiro carregar as categorias
        await loadCategories();

        if (isEditing && product) {
          // Depois preencher formulário com dados do produto
          populateForm(product);
        } else {
          // Limpar formulário para criação
          form.resetFields();
          setFileList([]);
        }
      };

      initializeModal();
    }
  }, [visible, form, isEditing, product]);

  // Função populateForm atualizada
  const populateForm = (productData: ProductInterface) => {
    console.log('productdata', productData);

    // Converter strings para numbers onde necessário
    const price =
      typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price;

    const weight =
      typeof productData.weight === 'string' ? parseFloat(productData.weight) : productData.weight;

    const stockQuantity =
      typeof productData.stock_quantity === 'string'
        ? parseInt(productData.stock_quantity, 10)
        : productData.stock_quantity;

    // Aguardar um tick para garantir que o DOM foi atualizado
    setTimeout(() => {
      form.setFieldsValue({
        category_id: productData.category || productData.category_id,
        name: productData.name || '',
        description: productData.description || '',
        sku: productData.sku || '',
        price: price || 0,
        weight: weight || undefined,
        gold_purity: productData.gold_purity || undefined,
        stock_quantity: stockQuantity || 0,
        is_active: productData.is_active ?? true,
        featured: productData.featured ?? false,
      });

      console.log('Form values set:', form.getFieldsValue());
    }, 100);

    // Preencher lista de imagens
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
    } catch (error) {
      message.error('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (values: CreateProductBody) => {
    try {
      setLoading(true);

      // Separar imagens novas das existentes
      const newImageFiles = fileList
        .filter((file) => file.originFileObj && !file.response?.url)
        .map((file) => file.originFileObj as File);

      const existingImages = fileList
        .filter((file) => file.response?.url || file.url)
        .map((file) => ({
          id: file.uid.startsWith('existing-') ? file.uid.replace('existing-', '') : undefined,
          image_url: file.response?.url || file.url,
          alt_text: file.name || `${values.name} - Imagem`,
        }));

      let newImageUrls: string[] = [];

      // Upload das imagens novas (se houver)
      if (newImageFiles.length > 0) {
        try {
          // TODO: Implementar upload de imagens
          // newImageUrls = await uploadProductImages(newImageFiles);
          console.log('Arquivos para upload:', newImageFiles);
          // Por enquanto, simular URLs das novas imagens
          newImageUrls = newImageFiles.map(
            (_, index) => `https://example.com/new-image-${Date.now()}-${index}.jpg`
          );
        } catch (error) {
          message.error('Erro no upload das imagens');
          return;
        }
      }

      // Combinar imagens existentes com novas
      const allImages = [
        ...existingImages,
        ...newImageUrls.map((url, index) => ({
          image_url: url,
          alt_text: `${values.name} - Nova Imagem ${index + 1}`,
        })),
      ];

      // Preparar dados do produto
      const productData: CreateProductBody & { images?: any[] } = {
        ...values,
        images: allImages,
      };

      let result;

      if (isEditing && product) {
        // Atualizar produto existente
        result = await updateProduct(product.id!, productData);
        message.success('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        const {
          category_id,
          name,
          price,
          description,
          sku,
          weight,
          gold_purity,
          stock_quantity,
          is_active,
          featured,
        } = productData;

        result = await createProduct(
          category_id,
          name,
          price,
          description,
          sku,
          weight,
          gold_purity,
          stock_quantity,
          is_active,
          featured
        );
        message.success('Produto criado com sucesso!');
      }

      console.log('Resultado da operação:', result);

      onSuccess(result || productData);
      handleCancel();
    } catch (error: any) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} produto:`, error);
      message.error(error.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} produto`);
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

    // Não validar SKU se estiver editando e o SKU não mudou
    if (isEditing && product && product.sku === sku) {
      return;
    }

    setSkuValidating(true);
    try {
      // TODO: Implementar validação de SKU
      // const isAvailable = await validateSKU(sku, product?.id);
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

  const beforeUpload = (file: RcFile) => {
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
        originFileObj: file as RcFile,
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
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            {/* Informações Básicas */}
            <Divider orientation="left">Informações Básicas</Divider>

            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={24} md={12} lg={10} xl={10}>
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
                  rules={[{ required: true, message: 'Categoria é obrigatória' }]}
                  initialValue={product?.category.id}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      placeholder="Selecione uma categoria"
                      style={{ flex: 1 }}
                      onChange={(value) => {
                        form.setFields([
                          {
                            name: 'category_id',
                            value: value,
                          },
                        ]);
                      }}
                    >
                      {categories.map((category, index) => (
                        <Option key={index} value={category.id}>
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
