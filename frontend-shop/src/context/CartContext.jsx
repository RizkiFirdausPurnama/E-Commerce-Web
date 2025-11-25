import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
const [cartCount, setCartCount] = useState(0);

  // Nanti fungsi ini akan kita lengkapi agar konek ke API
const addToCart = (productId, qty) => {
    setCartCount(prev => prev + qty);
};

return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
    {children}
    </CartContext.Provider>
);
};