import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Typography,
  Rate,
  Badge,
  Image,
  Empty,
  Pagination,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  FilterOutlined,

} from '@ant-design/icons';
import type { ProductInterface } from '../../interface/ProductInterface';
import { getProducts } from '../../services/productService';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () =>{
    const response = await getProducts()
    console.log(response.data)
    setProducts(response.data)
  };

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'audio', label: 'Áudio' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliação' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const ProductCard: React.FC<{ product: any }> = ({ product }) => (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
      }}
      bodyStyle={{ padding: 16 }}
      cover={
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            alt={product.name}
            src={product.image}
            height={240}
            style={{ objectFit: 'cover', width: '100%' }}
            preview={false}
          />
          {product.discount > 0 && (
            <Badge.Ribbon
              text={`-${product.discount}%`}
              color="#d4af37"
              style={{ top: 16, right: -8 }}
            />
          )}
          {!product.inStock && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tag color="red" style={{ fontSize: 14, padding: '8px 16px' }}>
                Fora de Estoque
              </Tag>
            </div>
          )}
        </div>
      }
    >
      <div style={{ minHeight: 180 }}>
        <Title level={5} style={{ marginBottom: 8, color: '#1a1a1a' }}>
          {product.name}
        </Title>

        <Paragraph
          style={{ color: '#666', fontSize: 13, marginBottom: 12 }}
          ellipsis={{ rows: 2 }}
        >
          {product.description}
        </Paragraph>

        <div style={{ marginBottom: 12 }}>
          <Space align="center">
            <Rate
              disabled
              defaultValue={product.rating}
              style={{ fontSize: 12, color: '#d4af37' }}
            />
            <Text style={{ color: '#999', fontSize: 12 }}>
              ({product.reviews})
            </Text>
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          {product.originalPrice > product.price && (
            <Text delete style={{ color: '#999', fontSize: 12, marginRight: 8 }}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
          <Title level={4} style={{ color: '#d4af37', margin: 0 }}>
            {formatPrice(product.price)}
          </Title>
        </div>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            disabled={!product.inStock}
            style={{
              background: product.inStock ? '#d4af37' : undefined,
              borderColor: product.inStock ? '#d4af37' : undefined,
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            {product.inStock ? 'Adicionar' : 'Indisponível'}
          </Button>
          <Button
            icon={<HeartOutlined />}
            style={{ borderRadius: 8 }}
          />
        </Space>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: '24px 0', background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Title level={2} style={{ color: '#1a1a1a', marginBottom: 8 }}>
            Nossos Produtos
          </Title>
          <Paragraph style={{ color: '#666', fontSize: 16 }}>
            Descubra nossa coleção exclusiva de produtos premium
          </Paragraph>
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
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
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
                {sortOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Text style={{ color: '#666', fontSize: 14 }}>
                {filteredProducts.length} produto(s)
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {filteredProducts.map(product => (
                <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Pagination
                current={currentPage}
                total={filteredProducts.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} de ${total} produtos`
                }
                style={{ fontSize: 14 }}
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Empty
              description={
                <span style={{ color: '#666' }}>
                  Nenhum produto encontrado para os filtros selecionados
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
