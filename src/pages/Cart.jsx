import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // คำนวณราคารวมทั้งหมด
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', background: 'white', marginTop: '3rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#102a42', marginBottom: '2rem' }}>Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.2rem', margin: '3rem 0' }}>You have no items in your cart</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cartItems.map((item, index) => (
            <li key={index} style={{ borderBottom: '1px solid #e2e8f0', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
              {/* ฝั่งซ้าย: ข้อมูลสินค้า */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#102a42', fontSize: '1.2rem' }}>{item.title}</h4>
                
                {/* 🟢 แสดง Option ที่เลือก (ถ้ามี) */}
                {item.options && item.options.length > 0 && (
                  <p style={{ margin: '0 0 0.3rem 0', color: '#64748b', fontSize: '0.95rem' }}>
                    <strong>ตัวเลือก:</strong> {item.options.join(', ')}
                  </p>
                )}

                {/* 🟢 แสดงคำขอพิเศษ (ถ้ามี) */}
                {item.specialRequest && (
                  <p style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontSize: '0.95rem', fontStyle: 'italic' }}>
                    <strong>หมายเหตุ:</strong> {item.specialRequest}
                  </p>
                )}

                <p style={{ margin: '0.5rem 0 0 0', color: '#475569' }}>
                  จำนวน: {item.quantity} x ${item.price}
                </p>
              </div>

              {/* ฝั่งขวา: ราคารวมของรายการนี้ */}
              <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                <strong style={{ fontSize: '1.2rem', color: '#102a42' }}>
                  ${(item.quantity * item.price).toFixed(2)}
                </strong>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* สรุปราคารวม */}
      <div style={{ marginTop: '2rem', borderTop: '2px solid #102a42', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#102a42' }}>ราคารวมทั้งหมด:</h3>
        <h2 style={{ margin: 0, color: '#f59e0b' }}>${totalPrice.toFixed(2)}</h2>
      </div>

      {/* ปุ่มกดดำเนินการต่อ */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/')} className="filter-btn" style={{ margin: 0 }}>
          สั่งอาหารเพิ่ม
        </button>
        {cartItems.length > 0 && (
          <button className="filter-btn" style={{ background: '#102a42', color: 'white', borderColor: '#102a42', margin: 0 }}>
            confirm order
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;