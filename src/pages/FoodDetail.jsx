import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [specialRequest, setSpecialRequest] = useState('');

  // 🟢 ดึงข้อมูลสินค้าชิ้นนี้จาก Firebase ด้วย ID
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFood({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("ไม่พบข้อมูลสินค้านี้");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodDetail();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>กำลังเตรียมข้อมูล... 🍽️</h2>;
  if (!food) return <h2 style={{ textAlign: 'center', marginTop: '5rem', color: '#ef4444' }}>ไม่พบเมนูอาหารนี้!</h2>;

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleOptionChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
  };

  const handleAddToCart = () => {
    let optionsPrice = 0;
    if (food.options) {
      selectedOptions.forEach(optLabel => {
        const optionDetails = food.options.find(o => o.label === optLabel);
        if (optionDetails) optionsPrice += optionDetails.price;
      });
    }

    const productWithOptions = { 
      ...food, 
      price: food.price + optionsPrice, 
      options: selectedOptions,
      specialRequest: specialRequest 
    };
    
    addToCart(productWithOptions, quantity);
    alert(`เพิ่ม ${food.title} จำนวน ${quantity} รายการลงตะกร้าแล้ว!`);
    navigate('/cart');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '5rem auto', display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '0 2rem' }}>
      
      {/* รูปภาพ */}
      <div style={{ flex: '1 1 400px' }}>
        <img 
          src={food.img || 'https://images.unsplash.com/photo-1495474472201-411db1cd92b5?w=500&q=80'} 
          alt={food.title} 
          style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} 
        />
      </div>

      {/* รายละเอียดและการสั่งซื้อ */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#102a42', fontSize: '2.2rem' }}>{food.title}</h2>
          <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '2rem' }}>{food.price} บ.</h3>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          {food.desc || 'เมนูแนะนำจากทางร้าน ทำสดใหม่ทุกวัน'}
        </p>

        {/* ตัวเลือกเสริม (ถ้ามีใน Firebase) */}
        {food.options && food.options.length > 0 && (
          <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: 0, color: '#102a42', fontSize: '1.2rem', marginBottom: '1rem' }}>ตัวเลือกเพิ่มเติม:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {food.options.map((opt, index) => (
                <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '1.1rem', color: '#475569' }}>
                  <input type="checkbox" value={opt.label} onChange={handleOptionChange} style={{ width: '1.2rem', height: '1.2rem' }} />
                  {opt.label} {opt.price > 0 ? `(+${opt.price} บ.)` : ''}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* หมายเหตุ */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ margin: 0, color: '#102a42', fontSize: '1.2rem', marginBottom: '0.8rem' }}>คำขอพิเศษ:</h4>
          <textarea 
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="เช่น ไม่เผ็ด, แยกน้ำยำ, ขอช้อนส้อมเพิ่ม..."
            style={{ width: '100%', minHeight: '80px', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        {/* เพิ่มลดจำนวน */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', background: '#f1f5f9', padding: '1rem', borderRadius: '10px', width: 'fit-content' }}>
          <span style={{ fontWeight: 'bold', color: '#102a42', fontSize: '1.1rem' }}>จำนวน:</span>
          <button onClick={handleDecrease} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1.5rem', borderRadius: '8px', border: 'none', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>-</button>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#102a42', width: '2rem', textAlign: 'center' }}>{quantity}</span>
          <button onClick={handleIncrease} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1.5rem', borderRadius: '8px', border: 'none', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>+</button>
        </div>

        {/* ปุ่มยืนยัน */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleAddToCart} style={{ flex: 1, background: '#16a34a', color: 'white', padding: '1rem', fontSize: '1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(22, 163, 74, 0.3)' }}>
            🛒 เพิ่มลงตะกร้า
          </button>
          <button onClick={() => navigate('/')} style={{ flex: 1, background: 'white', color: '#102a42', padding: '1rem', fontSize: '1.2rem', border: '2px solid #102a42', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            กลับหน้าเมนู
          </button>
        </div>

      </div>
    </div>
  );
};

export default FoodDetail;