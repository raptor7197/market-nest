import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'marketnest_cart';

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product === product._id);
      if (existing) {
        return current.map((item) =>
          item.product === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, 99),
              }
            : item
        );
      }
      return [
        ...current,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          brandName: product.brand?.name || '',
          quantity: Math.min(quantity, 99),
        },
      ];
    });
  };

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), 99) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
