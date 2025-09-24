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
<<<<<<< HEAD
import type { RcFile } from 'antd/lib/upload';
import type { UploadProgress } from '../../../interface/UploadInterface';
import { uploadProductImages } from '../../../services/uploadService';
=======
import type { RcFile, UploadProps } from 'antd/lib/upload';
import {
  deleteProductImage,
  getProductImages,
  uploadFileToStorage,
  uploadProductImages,
} from '../../../services/productImageService';
>>>>>>> a82c04f5f15be514a6e201a1af11c8f2e31d64f5

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
    if (isEditing && product?.id) {
      loadExistingImages();
    }
  }, [isEditing, product]);

  useEffect(() => {
    if (visible) {
      setFormInitialized(false);
      const initializeModal = async () => {
        try {
          // Primeiro carregar as categorias
          await loadCategories();

          if (isEditing && product) {
            // Depois preencher formulário com dados do produto
            await populateForm(product);
          } else {
            // Limpar formulário para criação
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
      // Reset quando modal fecha
      setFormInitialized(false);
      form.resetFields();
      setFileList([]);
    }
  }, [visible, isEditing, product?.id]); // Adicionar product.id como dependência

  // Função populateForm atualizada
  const populateForm = async (productData: ProductInterface) => {
    // Converter strings para numbers onde necessário
    const price =
      typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price;

    const weight =
      typeof productData.weight === 'string' ? parseFloat(productData.weight) : productData.weight;

    const stockQuantity =
      typeof productData.stock_quantity === 'string'
        ? parseInt(productData.stock_quantity, 10)
        : productData.stock_quantity;

    // Preparar os valores do formulário
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

    // Usar pequeno delay para garantir que as categorias foram carregadas
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Resetar formulário primeiro
    form.resetFields();

    // Aguardar um pouco mais para o reset
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Definir todos os valores de uma vez
    form.setFieldsValue(formValues);

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
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      message.error('Erro ao carregar categorias');
      throw error;
    }
  };

  const loadExistingImages = async () => {
    try {
      if (product) {
        const images = await getProductImages(product.id);
        const existingFiles: UploadFile[] = images.map((img, index) => ({
          uid: `existing-${img.id}`,
          name: img.alt_text || `Imagem ${index + 1}`,
          status: 'done',
          url: img.image_url,
          response: { url: img.image_url },
        }));
        setFileList(existingFiles);
      }
    } catch (error) {
      console.error('Erro ao carregar imagens existentes:', error);
    }
  };

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    fileList,
    multiple: true,
    beforeUpload: (file) => {
      // Validações no frontend
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
        file.type
      );
      if (!isValidType) {
        message.error('Apenas arquivos JPG, PNG e WEBP são permitidos!');
        return false;
      }

      const isValidSize = file.size / 1024 / 1024 < 5; // 5MB
      if (!isValidSize) {
        message.error('O arquivo deve ter no máximo 5MB!');
        return false;
      }

      // Impedir upload automático
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: async (file) => {
      try {
        // Se for uma imagem existente, deletar do servidor
        if (file.uid.startsWith('existing-')) {
          const imageId = file.uid.replace('existing-', '');
          await deleteProductImage(imageId);
          message.success('Imagem removida com sucesso!');
        }
        return true;
      } catch (error) {
        console.error('Erro ao remover imagem:', error);
        message.error('Erro ao remover imagem');
        return false;
      }
    },
    customRequest: () => {
      // Desabilitar upload automático
    },
  };

  const handleSubmit = async (values: CreateProductBody) => {
    try {
      setLoading(true);

      // 1. Separar arquivos novos dos existentes
      const newImageFiles = fileList
        .filter((file) => file.originFileObj && !file.response?.url)
        .map((file) => file.originFileObj as File);

      const existingImages = fileList
        .filter((file) => file.response?.url || file.url)
        .map((file, index) => ({
          id: file.uid.startsWith('existing-') ? file.uid.replace('existing-', '') : undefined,
<<<<<<< HEAD
          image_url: file.response?.url || file.url || '',
=======
          image_url: file.response?.url || file.url!,
>>>>>>> a82c04f5f15be514a6e201a1af11c8f2e31d64f5
          alt_text: file.name || `${values.name} - Imagem`,
          is_primary: index === 0, // Primeira imagem como principal
          sort_order: index,
        }));

<<<<<<< HEAD
      let newImageUrls: string[] = [];

      // Upload das imagens novas via backend
      if (newImageFiles.length > 0) {
        try {
          let uploadMessageKey: any;

          // Callback para progresso do upload
          const onProgress = (progress: UploadProgress) => {
            // Destruir mensagem anterior se existir
            if (uploadMessageKey) {
              message.destroy(uploadMessageKey);
            }

            // Mostrar nova mensagem com progresso
            uploadMessageKey = message.loading(`Enviando imagens... ${progress.percentage}%`, 0);
          };

          // Mostrar mensagem inicial
          uploadMessageKey = message.loading('Iniciando upload das imagens...', 0);

          // Fazer upload via backend
          newImageUrls = await uploadProductImages(newImageFiles, values.name);

          // Remover mensagem de loading
          if (uploadMessageKey) {
            message.destroy(uploadMessageKey);
          }

          message.success(`${newImageUrls.length} imagem(ns) enviada(s) com sucesso!`);
        } catch (error) {
          message.destroy(); // Remove qualquer mensagem de loading
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

=======
      // 2. Criar ou atualizar o produto
>>>>>>> a82c04f5f15be514a6e201a1af11c8f2e31d64f5
      let result;
      let productId: string;

      if (isEditing && product) {
        result = await updateProduct(product.id!, values);
        productId = product.id!;
        message.success('Produto atualizado com sucesso!');
      } else {
<<<<<<< HEAD
        // Criar novo produto
        result = await createProduct(productData);
=======
        const productData = {
          category_id: values.category_id,
          name: values.name,
          price: values.price,
          description: values.description,
          sku: values.sku,
          weight: values.weight,
          gold_purity: values.gold_purity,
          stock_quantity: values.stock_quantity,
          is_active: values.is_active,
          featured: values.featured,
        };

        result = await createProduct(productData);
        productId = result.data.id; // Ajustar conforme estrutura da sua API
>>>>>>> a82c04f5f15be514a6e201a1af11c8f2e31d64f5
        message.success('Produto criado com sucesso!');
      }

      // 3. Processar novas imagens se existirem
      if (newImageFiles.length > 0) {
        try {
          message.loading('Fazendo upload das imagens...', 0);

          // Upload dos arquivos para obter URLs
          const uploadPromises = newImageFiles.map(async (file, index) => {
            try {
              setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

              const url = await uploadFileToStorage(file);

              setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

              return {
                product_id: productId,
                image_url: url,
                alt_text: `${values.name} - ${file.name}`,
                is_primary: existingImages.length === 0 && index === 0,
                sort_order: existingImages.length + index,
              };
            } catch (error) {
              console.error(`Erro no upload de ${file.name}:`, error);
              setUploadProgress((prev) => ({ ...prev, [file.name]: -1 }));
              throw error;
            }
          });

          const newImageData = await Promise.all(uploadPromises);

          // Salvar registros das imagens no banco
          await uploadProductImages(newImageData);

          message.destroy(); // Remove loading message
          message.success(`${newImageFiles.length} imagens processadas com sucesso!`);
        } catch (error) {
          message.destroy();
          console.error('Erro ao processar imagens:', error);
          message.warning('Produto salvo, mas houve erro ao processar algumas imagens');
        }
      }

      // 4. Callback de sucesso
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

  // Atualize também o beforeUpload para ser mais simples:
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

    // Criar preview da imagem (não faz upload ainda)
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

  // Não renderizar o formulário até que esteja totalmente inicializado
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          preserve={false} // Importante: não preservar valores entre renderizações
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
                  initialValue={form.getFieldValue('name')}
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
                  initialValue={form.getFieldValue('sku')}
                >
                  <Input
                    placeholder="EX: PROD-001"
                    onBlur={(e) => handleSkuValidation(e.target.value)}
                    disabled={isEditing}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                <Form.Item
                  name="description"
                  label="Descrição"
                  initialValue={form.getFieldValue('description')}
                >
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
                  initialValue={form.getFieldValue('category_id')}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      placeholder="Selecione uma categoria"
                      style={{ flex: 1 }}
                      value={form.getFieldValue('category_id')}
                      onChange={(value) => {
                        form.setFieldValue('category_id', value);
                      }}
                      showSearch
                      optionFilterProp="children"
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
                  initialValue={form.getFieldValue('price')}
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
                <Form.Item
                  name="weight"
                  label="Peso (g)"
                  initialValue={form.getFieldValue('weight')}
                >
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
                <Form.Item
                  name="gold_purity"
                  label="Pureza do Ouro"
                  initialValue={form.getFieldValue('gold_purity')}
                >
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
                <Form.Item
                  name="stock_quantity"
                  label="Quantidade em Estoque"
                  initialValue={form.getFieldValue('stock_quantity')}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
                </Form.Item>
              </Col>
            </Row>

            {/* Configurações */}
            <Divider orientation="left">Configurações</Divider>

            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={10} lg={10} xl={10}>
                <Form.Item
                  name="is_active"
                  label="Produto Ativo"
                  valuePropName="checked"
                  initialValue={form.getFieldValue('is_active')}
                >
                  <Switch />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={10} lg={10} xl={10}>
                <Form.Item
                  name="featured"
                  label="Produto em Destaque"
                  valuePropName="checked"
                  initialValue={form.getFieldValue('featured')}
                >
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
