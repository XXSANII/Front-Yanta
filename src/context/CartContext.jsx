import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // 🟢 ดึงข้อมูลออเดอร์แบบ Real-time (ไม่ต้อง Refresh หน้าจอ)
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const cartItemId = `${product.id}-${JSON.stringify(product.options)}-${product.specialRequest}`;
      const existingItemIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      return [...prevItems, { ...product, quantity, cartItemId }];
    });
  };

  // 🟢 ยืนยันออเดอร์: ส่งขึ้นไปบน Cloud Firestore
  const confirmOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      await addDoc(collection(db, "orders"), {
        items: cartItems,
        timestamp: Date.now(),
        timeStr: new Date().toLocaleTimeString('th-TH'),
        status: 'pending'
      });
      setCartItems([]);
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการส่งออเดอร์: " + e.message);
    }
  };

  // 🟢 ครัวทำเสร็จ: ลบข้อมูลออกจาก Cloud
  const completeOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (e) {
      console.error("Error deleting order: ", e);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, orders, confirmOrder, completeOrder }}>
      {children}
    </CartContext.Provider>
  );
};