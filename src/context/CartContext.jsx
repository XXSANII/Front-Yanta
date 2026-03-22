import React, { createContext, useState } from 'react';

// สร้าง Context เพื่อให้ทุกหน้าใช้ข้อมูลตะกร้าร่วมกันได้
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ฟังก์ชันเพิ่มลงตะกร้า
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      // เช็คว่ามีสินค้านี้ในตะกร้าหรือยัง
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // ถ้ามีแล้ว ให้อัปเดตจำนวนเพิ่มขึ้น
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
      return [...prevItems, { ...product, quantity }];
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};