import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ZoneType } from '../types';

interface OrderItemDraft {
  product: Product;
  quantityKg: number;
  selectedSize?: string;
}

interface OrderContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedZone: ZoneType;
  setSelectedZone: (zone: ZoneType) => void;
  cartItems: OrderItemDraft[];
  addToCart: (product: Product, quantityKg: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantityKg: number) => void;
  clearCart: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedZone, setSelectedZone] = useState<ZoneType>('himachal');
  const [cartItems, setCartItems] = useState<OrderItemDraft[]>([]);

  const addToCart = (product: Product, quantityKg: number, selectedSize?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantityKg: item.quantityKg + quantityKg, selectedSize: selectedSize || item.selectedSize }
            : item
        );
      }
      return [...prev, { product, quantityKg, selectedSize }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantityKg: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantityKg: Math.max(0.25, quantityKg) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <OrderContext.Provider
      value={{
        selectedProduct,
        setSelectedProduct,
        selectedZone,
        setSelectedZone,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
