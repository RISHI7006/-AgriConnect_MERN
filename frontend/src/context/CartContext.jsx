import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('agriconnect_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agriconnect_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 100, customPrice = null) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      const pricePerKg = customPrice !== null ? customPrice : product.pricePerKg;
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity, pricePerKg }
            : item
        );
      }
      return [...prev, { product, quantity, pricePerKg }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItemsCount = cart.reduce((acc, item) => acc + 1, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.pricePerKg * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
