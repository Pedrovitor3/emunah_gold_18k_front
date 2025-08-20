/**
 * Contexto do carrinho de compras
 * Emunah Gold 18K - Frontend
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CartContextType } from '../types';
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
        // Se já existe, aumenta a quantidade
        const updatedItems = currentItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        message.success(`${product.name} - quantidade atualizada no carrinho`);
        return updatedItems;
      } else {
        // Se não existe, adiciona novo item
        const newItem: CartItem = {
          id: `cart_${Date.now()}`, // ID temporário para o frontend
          user_id: '', // Será preenchido quando sincronizar com backend
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
      const filteredItems = currentItems.filter(item => item.product_id !== productId);
      const removedItem = currentItems.find(item => item.product_id === productId);
      if (removedItem) {
        message.info(`${removedItem.product?.name} removido do carrinho`);
      }
      return filteredItems;
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
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
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
    itemCount
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