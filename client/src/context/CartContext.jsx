import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'marketnest_cart';
const MAX_QTY = 99;

const sanitizeItem = (raw) => {
  if (!raw || typeof raw !== 'object') return null;

  const product = typeof raw.product === 'string' ? raw.product : null;
  const price = Number(raw.price);
  const quantity = Number(raw.quantity);
  if (!product || !Number.isFinite(price) || price < 0) return null;
  if (!Number.isFinite(quantity) || quantity < 1) return null;

  const rawStock = Number(raw.stock);
  const stock =
    Number.isFinite(rawStock) && rawStock >= 0
      ? Math.floor(rawStock)
      : MAX_QTY;

  return {
    product,
    name: typeof raw.name === 'string' ? raw.name : 'Product',
    price,
    image: typeof raw.image === 'string' ? raw.image : '',
    brandName: typeof raw.brandName === 'string' ? raw.brandName : '',
    stock,
    quantity: Math.min(Math.floor(quantity), MAX_QTY, Math.max(stock, 1)),
  };
};

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeItem).filter(Boolean);
  } catch {
    return [];
  }
};

const capFor = (value) => {
  const stock = Number(value);
  return Number.isFinite(stock) && stock >= 0
    ? Math.min(Math.floor(stock), MAX_QTY)
    : MAX_QTY;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);
  const { user } = useAuth();
  const previousUserId = useRef(user?.id ?? null);

  // Clear the cart when the user logs out or switches accounts so the next
  // person on this browser never inherits someone else's cart.
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (previousUserId.current && previousUserId.current !== currentUserId) {
      setItems([]);
    }
    previousUserId.current = currentUserId;
  }, [user?.id]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable (private mode/quota); cart still works in memory.
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    if (!product?._id) return;
    const cap = capFor(product.stock);
    if (cap <= 0) return;

    const requested = Math.min(
      Math.max(Math.floor(Number(quantity) || 1), 1),
      MAX_QTY
    );

    setItems((current) => {
      const existing = current.find((item) => item.product === product._id);

      if (existing) {
        return current.map((item) =>
          item.product === product._id
            ? {
                ...item,
                name: product.name ?? item.name,
                price: Number(product.price) || item.price,
                image: product.images?.[0] || item.image,
                brandName: product.brand?.name || item.brandName,
                stock: cap,
                quantity: Math.min(item.quantity + requested, cap),
              }
            : item
        );
      }

      return [
        ...current,
        {
          product: product._id,
          name: product.name || 'Product',
          price: Number(product.price) || 0,
          image: product.images?.[0] || '',
          brandName: product.brand?.name || '',
          stock: cap,
          quantity: Math.min(requested, cap),
        },
      ];
    });
  };

  const updateItem = (productId, patch = {}) => {
    setItems((current) =>
      current.map((item) => {
        if (item.product !== productId) return item;
        const next = { ...item, ...patch };
        const cap = capFor(next.stock);
        return {
          ...next,
          stock: cap,
          quantity: Math.min(
            Math.max(Math.floor(next.quantity) || 1, 1),
            Math.max(cap, 1)
          ),
        };
      })
    );
  };

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (!Number.isFinite(Number(quantity))) return;
    setItems((current) =>
      current.map((item) => {
        if (item.product !== productId) return item;
        const cap = capFor(item.stock);
        return {
          ...item,
          quantity: Math.min(Math.max(Math.floor(quantity), 1), cap),
        };
      })
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      Math.round(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
      ) / 100,
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        updateItem,
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
