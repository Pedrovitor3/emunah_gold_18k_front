import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Empty,
  Pagination,
  Button,
  Space,
  Tooltip,
  Modal,
  message,
} from 'antd';
import {
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ProductInterface } from '../../interface/ProductInterface';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import CategoryInterface from '../../interface/CategoryInterface';
import ProductCard from '../../components/Card/ProductCard.ts';
import { useAuth } from '../../contexts/AuthContext';
import ProductModal from '../../components/Modal/ModalProduct';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      message.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Handlers Admin
  const handleCreateProduct = () => {
    setShowModal(true);
  };

  const handleModalProductSuccess = (newProduct: any) => {
    // Adicionar o novo produto à lista
    setProducts((prev) => [newProduct, ...prev]);
    setShowModal(false);
    message.success('Produto criado com sucesso!');
  };

  const handleModalProductCancel = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const handleEditProduct = (productId: string) => {
    const productFiltered = products.find((p) => p.id === productId);
    setSelectedProduct(productFiltered);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    Modal.confirm({
      title: 'Confirmar Exclusão',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Tem certeza que deseja excluir o produto:</p>
          <p>
            <strong>{product.name}</strong>
          </p>
          <p style={{ color: '#ff4d4f', fontSize: '14px' }}>Esta ação não pode ser desfeita.</p>
        </div>
      ),
      okText: 'Sim, Excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          // Aqui você faria a chamada para sua API de delete
          // await deleteProduct(productId);

          // Por enquanto, apenas remove do estado local
          setProducts((prev) => prev.filter((p) => p.id !== productId));
          message.success('Produto excluído com sucesso!');
        } catch (error) {
          message.error('Erro ao excluir produto');
          console.error('Erro:', error);
        }
      },
    });
  };

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliação' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      // case 'rating':
      //   return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Paginação
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ padding: '24px 0', background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: user?.is_admin ? 24 : 0 }}>
            <Title level={2} style={{ color: '#1a1a1a', marginBottom: 8 }}>
              Nossos Produtos
            </Title>
            <Paragraph style={{ color: '#666', fontSize: 16 }}>
              Descubra nossa coleção exclusiva de produtos premium
            </Paragraph>
          </div>

          {/* Painel Admin */}
          {user?.is_admin && (
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e8f4f8',
                background: 'linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%)',
                marginBottom: 24,
              }}
              bodyStyle={{ padding: '16px 24px' }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Text strong style={{ color: '#0369a1' }}>
                      Painel Administrativo
                    </Text>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Tooltip title="Criar novo produto">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateProduct}
                        style={{
                          backgroundColor: '#0369a1',
                          borderColor: '#0369a1',
                        }}
                      >
                        Novo Produto
                      </Button>
                    </Tooltip>
                  </Space>
                </Col>
              </Row>
            </Card>
          )}
        </div>

        {/* Filters */}
        <Card
          style={{
            marginBottom: 32,
            borderRadius: 12,
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Buscar produtos..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
                size="large"
                loading={loading}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '100%' }}
                size="large"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">Todas as categorias</Option>
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
                size="large"
                placeholder="Ordenar por"
              >
                {sortOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Text style={{ color: '#666', fontSize: 14 }}>
                {sortedProducts.length} produto(s)
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {paginatedProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                  <div style={{ position: 'relative' }}>
                    <ProductCard product={product} onEdit={handleEditProduct} />

                    {/* Botões Admin sobrepostos */}
                    {user?.is_admin && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 10,
                          display: 'flex',
                          gap: 4,
                        }}
                      >
                        <Tooltip title="Editar produto">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product.id);
                            }}
                            style={{
                              backgroundColor: '#0369a1',
                              borderColor: '#0369a1',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Excluir produto">
                          <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            style={{
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Pagination
                current={currentPage}
                total={sortedProducts.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} produtos`}
                style={{ fontSize: 14 }}
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Empty
              description={
                <span style={{ color: '#666' }}>
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Nenhum produto encontrado para os filtros selecionados'
                    : 'Nenhum produto cadastrado'}
                </span>
              }
            />
            {user?.is_admin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateProduct}
                style={{
                  marginTop: 16,
                  backgroundColor: '#d4af37',
                  borderColor: '#d4af37',
                }}
              >
                {products.length === 0 ? 'Criar Primeiro Produto' : 'Criar Novo Produto'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal para criar produto */}
      <ProductModal
        visible={showModal}
        onCancel={handleModalProductCancel}
        onSuccess={handleModalProductSuccess}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage;
