// hooks/useNavigation.ts
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteNames, ROUTES } from '../routes';
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

  const isCurrentRoute = (route: RouteNames): boolean => {
    return location.pathname === route;
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

    // Utilitários
    isCurrentRoute,
    currentPath: location.pathname,

    // Constantes das rotas
    routes: ROUTES,
  };
};
