import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  wishlist: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) setItems(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const addToWishlist = (id: number) => {
    setWishlist(current => {
      if (!current.includes(id)) {
        return [...current, id];
      }
      return current;
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(current => current.filter(itemId => itemId !== id));
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      wishlist,
      addToWishlist,
      removeFromWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};