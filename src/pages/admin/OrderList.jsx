import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. ตรวจสอบสิทธิ์การเข้าถึง (Admin Only)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
    });

    // 2. ดึงข้อมูลออเดอร์แบบ Real-time (เรียงลำดับตามเวลาล่าสุด)
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const orderData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderData);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeOrders();
    };
  }, [navigate]);

  // 3. ฟังก์ชันเปลี่ยนสถานะออเดอร์
  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      alert("ไม่สามารถเปลี่ยนสถานะได้: " + error.message);
    }
  };

  // 4. ฟังก์ชันลบออเดอร์ (เมื่อชำระเงินเรียบร้อย หรือยกเลิก)
  const deleteOrder = async (orderId) => {
    if (window.confirm("ยืนยันการเคลียร์ออเดอร์นี้ (เช็กบิลเรียบร้อย)?")) {
      await deleteDoc(doc(db, "orders", orderId));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดออเดอร์...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#1e293b' }}>🧾 รายการออเดอร์ลูกค้า</h1>
        <button onClick={() => navigate('/admin')} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px' }}>ไปหน้าจัดการเมนู</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {orders.map((order) => (
          <div key={order.id} style={{ 
            background: 'white', 
            borderRadius: '15px', 
            padding: '20px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderTop: `8px solid ${order.status === 'pending' ? '#ef4444' : (order.status === 'cooking' ? '#f59e0b' : '#10b981')}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>โต๊ะ: {order.tableId}</span>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                background: order.status === 'pending' ? '#fee2e2' : '#d1fae5',
                color: order.status === 'pending' ? '#991b1b' : '#065f46'
              }}>
                {order.status === 'pending' ? '🔴 รอคิว' : (order.status === 'cooking' ? '🟡 กำลังทำ' : '🟢 เสิร์ฟแล้ว')}
              </span>
            </div>

            {/* รายการอาหารในออเดอร์นั้นๆ */}
            <div style={{ marginBottom: '15px' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><b>{item.qty} x {item.title}</b></span>
                    <span>{item.totalItemPrice}.-</span>
                  </div>
                  {item.options && item.options.map((opt, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', color: '#64748b' }}>- {opt.label} (+{opt.price})</div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#1e293b', marginBottom: '20px' }}>
              รวมทั้งสิ้น: {order.totalAmount} บาท
            </div>

            {/* ปุ่มจัดการสถานะ */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {order.status === 'pending' && (
                <button onClick={() => updateStatus(order.id, 'cooking')} style={{ flex: 1, padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>เริ่มทำ</button>
              )}
              {order.status === 'cooking' && (
                <button onClick={() => updateStatus(order.id, 'served')} style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>เสิร์ฟแล้ว</button>
              )}
              {order.status === 'served' && (
                <button onClick={() => deleteOrder(order.id)} style={{ flex: 1, padding: '10px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>เช็กบิล/เคลียร์</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '100px' }}>
          <h3>ยังไม่มีออเดอร์ใหม่เข้ามาในขณะนี้...</h3>
        </div>
      )}
    </div>
  );
};

export default OrderList;