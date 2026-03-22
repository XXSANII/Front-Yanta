import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import menuData from '../data';

const FoodDetail = () => {
  const { id } = useParams(); // ดึง ID จาก URL
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); // ดึงฟังก์ชันเพิ่มลงตะกร้ามาใช้
  
  // ค้นหาข้อมูลอาหารจาก ID
  const food = menuData.find((item) => item.id === parseInt(id));
  
  const [quantity, setQuantity] = useState(1);

  if (!food) return <h2>Food not found!</h2>;

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    alert(`เพิ่ม ${food.title} จำนวน ${quantity} รายการลงตะกร้าแล้ว!`);
    navigate('/cart'); // สั่งเสร็จให้เด้งไปหน้า Cart
  };

  return (
    <div className="section-center" style={{ marginTop: '5rem', display: 'block', textAlign: 'center' }}>
      <img src={food.img} alt={food.title} style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }} />
      <h2>{food.title}</h2>
      <h3 style={{ color: '#f59e0b' }}>${food.price}</h3>
      <p>{food.desc}</p>

      {/* ปุ่มเพิ่ม/ลด จำนวน */}
      <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <button onClick={handleDecrease} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>-</button>
        <span style={{ fontSize: '1.5rem' }}>{quantity}</span>
        <button onClick={handleIncrease} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>+</button>
      </div>

      <button onClick={handleAddToCart} className="filter-btn" style={{ background: '#c2410c', color: 'white' }}>
        เพิ่มลงในตะกร้า
      </button>
      <br /><br />
      <button onClick={() => navigate('/')} className="filter-btn">กลับหน้าเมนู</button>
    </div>
  );
};

export default FoodDetail;