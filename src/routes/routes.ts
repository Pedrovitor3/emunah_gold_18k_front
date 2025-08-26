// constants/routes.ts - Versão expandida com todas as rotas necessárias

export const ROUTES = {
  // Rotas públicas
  LOGIN: '/login',
  REGISTER: '/register',

  // Rotas protegidas principais
  HOME: '/',
  PRODUCTS: '/produtos',
  PRODUCT_DETAIL: '/produtos/:id', // Template para rota dinâmica
  PROFILE: '/perfil',
  CART: '/carrinho',
  ORDERS: '/pedidos',

  // Rotas adicionais que podem ser úteis
  ABOUT: '/sobre',
  CONTACT: '/contato',
  FAVORITES: '/favoritos',
  SEARCH: '/buscar',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/pedido-confirmado',

  // Rotas de erro
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
} as const;

// Tipos para TypeScript
export type RouteNames = (typeof ROUTES)[keyof typeof ROUTES];

// Helper para verificar se uma rota é pública
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes: string[] = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.NOT_FOUND,
    ROUTES.UNAUTHORIZED,
  ];
  return publicRoutes.includes(pathname);
};

// Helper para verificar se uma rota é protegida
export const isProtectedRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname);
};

// Helper para gerar rota de produto com ID
export const getProductRoute = (id: string | number): string => {
  return `${ROUTES.PRODUCTS}/${id}`;
};

// Mapeamento de rotas para títulos (útil para breadcrumbs, etc.)
export const ROUTE_TITLES = {
  [ROUTES.HOME]: 'Início',
  [ROUTES.PRODUCTS]: 'Produtos',
  [ROUTES.PROFILE]: 'Meu Perfil',
  [ROUTES.CART]: 'Carrinho',
  [ROUTES.ORDERS]: 'Meus Pedidos',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.REGISTER]: 'Cadastro',
  [ROUTES.ABOUT]: 'Sobre Nós',
  [ROUTES.CONTACT]: 'Contato',
  [ROUTES.FAVORITES]: 'Favoritos',
  [ROUTES.SEARCH]: 'Buscar',
  [ROUTES.CHECKOUT]: 'Finalizar Compra',
  [ROUTES.ORDER_SUCCESS]: 'Pedido Confirmado',
} as const;

// Breadcrumb templates para rotas comuns
export const BREADCRUMB_TEMPLATES = {
  PRODUCT_DETAIL: [
    { href: ROUTES.HOME, title: 'Início' },
    { href: ROUTES.PRODUCTS, title: ROUTE_TITLES[ROUTES.PRODUCTS] },
    { title: 'Detalhes do Produto' }, // Será substituído pelo nome do produto
  ],
  CHECKOUT: [
    { href: ROUTES.HOME, title: 'Início' },
    { href: ROUTES.CART, title: ROUTE_TITLES[ROUTES.CART] },
    { title: ROUTE_TITLES[ROUTES.CHECKOUT] },
  ],
} as const;
