import axios from 'axios';
import { baseURL } from './baseUrl';

// Criar instância personalizada do Axios
const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variável para armazenar a função de logout do contexto
let logoutFunction: (() => void) | null = null;

// Função para configurar a função de logout
export const setLogoutFunction = (logout: () => void) => {
  logoutFunction = logout;
};

// Interceptor de requisição
apiClient.interceptors.request.use(
  config => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
apiClient.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', response.status);
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token inválido ou expirado
          console.log('Token expirado, fazendo logout...');

          // Usar a função de logout do contexto se disponível
          if (logoutFunction) {
            logoutFunction();
          } else {
            // Fallback para limpeza manual
            localStorage.removeItem('token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Acesso negado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error('Erro na requisição:', error.response.status);
      }
    } else if (error.request) {
      console.error('Erro de rede:', error.request);
    } else {
      console.error('Erro:', error.message);
    }

    return Promise.reject(error);
  }
);

export { apiClient };
