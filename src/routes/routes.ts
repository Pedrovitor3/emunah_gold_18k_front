// constants/routes.ts
export const ROUTES = {
  // Rotas públicas
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Rotas protegidas
  HOME: '/',
  PRODUCTS: '/produtos',
  PROFILE: '/perfil',
  CART: '/carrinho',
  ORDERS: '/pedidos',
} as const;

// Tipos para TypeScript
export type RouteNames = typeof ROUTES[keyof typeof ROUTES];

// Helper para verificar se uma rota é pública
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes: string[] = [ROUTES.LOGIN, ROUTES.REGISTER];
  return publicRoutes.includes(pathname);
};


// Helper para verificar se uma rota é protegida
export const isProtectedRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname);
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
} as const;