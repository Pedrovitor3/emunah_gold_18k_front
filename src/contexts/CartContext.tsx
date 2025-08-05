/**
 * Contexto do carrinho de compras
 * Emunah Gold 18K - Frontend
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, CartContextType } from '../types';
import { message } from 'antd';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  /**
   * Adicionar item ao carrinho
   */
  const addItem = (product: Product, quantity: number = 1): void => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Se o item já existe, atualiza a quantidade
        const updatedItems = currentItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        message.success(`${product.name} - quantidade atualizada no carrinho`);
        return updatedItems;
      } else {
        // Se é um novo item, adiciona ao carrinho
        const newItem: CartItem = {
          id: `temp_${Date.now()}`, // ID temporário para o frontend
          user_id: '', // Será preenchido quando integrar com o backend
          product_id: product.id,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product
        };
        message.success(`${product.name} adicionado ao carrinho`);
        return [...currentItems, newItem];
      }
    });
  };

  /**
   * Remover item do carrinho
   */
  const removeItem = (productId: string): void => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.product_id === productId);
      if (item?.product) {
        message.info(`${item.product.name} removido do carrinho`);
      }
      return currentItems.filter(item => item.product_id !== productId);
    });
  };

  /**
   * Atualizar quantidade de um item
   */
  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity, updated_at: new Date().toISOString() }
          : item
      )
    );
  };

  /**
   * Limpar carrinho
   */
  const clearCart = (): void => {
    setItems([]);
    message.info('Carrinho limpo');
  };

  /**
   * Calcular total do carrinho
   */
  const total = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  /**
   * Contar total de itens
   */
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook para usar o contexto do carrinho
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

