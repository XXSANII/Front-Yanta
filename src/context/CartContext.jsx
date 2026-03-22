import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      // 🟢 สร้าง ID เฉพาะสำหรับรายการนี้ โดยเอา ID อาหาร + ออปชัน + หมายเหตุ มารวมกัน
      // ทำให้ระบบแยกออกว่าอาหารชนิดเดียวกัน แต่สั่งคนละแบบ คือคนละรายการ
      const cartItemId = `${product.id}-${JSON.stringify(product.options)}-${product.specialRequest}`;

      const existingItemIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      if (existingItemIndex >= 0) {
        // ถ้าสั่งอาหารเมนูนี้ + ออปชันแบบเดิมเป๊ะๆ ให้บวกจำนวนเพิ่ม
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }

      // ถ้าเป็นเมนูใหม่ หรือ ออปชันไม่เหมือนเดิม ให้เพิ่มเป็นรายการใหม่
      return [...prevItems, { ...product, quantity, cartItemId }];
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};