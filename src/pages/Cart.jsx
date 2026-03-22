import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // คำนวณราคารวม
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>ตะกร้าสินค้าของคุณ</h2>
      {cartItems.length === 0 ? (
        <p>ยังไม่มีสินค้าในตะกร้า</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cartItems.map((item, index) => (
            <li key={index} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4>{item.title}</h4>
                <p>จำนวน: {item.quantity} x ${item.price}</p>
              </div>
              <div>
                <strong>${(item.quantity * item.price).toFixed(2)}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h3 style={{ textAlign: 'right', marginTop: '2rem' }}>ราคารวม: ${totalPrice.toFixed(2)}</h3>
      
      <button onClick={() => navigate('/')} className="filter-btn">สั่งอาหารเพิ่ม</button>
    </div>
  );
};

export default Cart;