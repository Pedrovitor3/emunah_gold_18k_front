// hooks/useNavigation.ts
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, type RouteNames } from '../routes/routes';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (route: RouteNames, options?: { replace?: boolean; state?: any }) => {
    navigate(route, {
      replace: options?.replace || false,
      state: options?.state,
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  const goToHome = () => {
    navigateTo(ROUTES.HOME, { replace: true });
  };

  const goToLogin = () => {
    navigateTo(ROUTES.LOGIN, { replace: true });
  };

  const goToProducts = () => {
    navigateTo(ROUTES.PRODUCTS);
  };

  const goToProfile = () => {
    navigateTo(ROUTES.PROFILE);
  };

  const goToCart = () => {
    navigateTo(ROUTES.CART);
  };

  const goToOrders = () => {
    navigateTo(ROUTES.ORDERS);
  };

  // Nova função para navegar para detalhes do produto
  const goToProductDetail = (productId: string | number) => {
    navigate(`${ROUTES.PRODUCTS}/${productId}`);
  };

  const isCurrentRoute = (route: RouteNames): boolean => {
    return location.pathname === route;
  };

  // Verifica se está numa página de produto específica
  const isProductDetailRoute = (): boolean => {
    return location.pathname.startsWith(ROUTES.PRODUCTS) && location.pathname.split('/').length > 2;
  };

  return {
    // Navegação genérica
    navigateTo,
    goBack,

    // Navegação específica
    goToHome,
    goToLogin,
    goToProducts,
    goToProfile,
    goToCart,
    goToOrders,
    goToProductDetail, // Nova função

    // Utilitários
    isCurrentRoute,
    isProductDetailRoute, // Nova função
    currentPath: location.pathname,

    // Constantes das rotas
    routes: ROUTES,
  };
};
