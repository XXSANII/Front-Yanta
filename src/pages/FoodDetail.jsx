import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import menuData from '../data';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const food = menuData.find((item) => item.id === parseInt(id));
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [specialRequest, setSpecialRequest] = useState('');

  if (!food) return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>Food not found!</h2>;

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
    const productWithOptions = { 
      ...food, 
      options: selectedOptions,
      specialRequest: specialRequest 
    };
    
    addToCart(productWithOptions, quantity);
    alert(`เพิ่ม ${food.title} จำนวน ${quantity} รายการลงตะกร้าแล้ว!`);
    navigate('/cart');
  };

  return (
    <div className="section-center" style={{ marginTop: '5rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
      
      <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
        <img 
          src={food.img} 
          alt={food.title} 
          style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
        />
      </div>

      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#102a42', fontSize: '2rem' }}>{food.title}</h2>
          <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '1.8rem' }}>${food.price}</h3>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          {food.desc}
        </p>

        {/* 🟢 เงื่อนไข: ตรวจสอบว่ามีข้อมูล options หรือไม่ ถ้ามีให้แสดง Checkbox */}
        {food.options && food.options.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: 0, color: '#102a42', fontSize: '1.2rem', marginBottom: '0.5rem' }}>ตัวเลือกเพิ่มเติม:</h4>
            
            {/* วนลูปสร้าง Checkbox ตามข้อมูลที่มีใน data.js */}
            {food.options.map((opt, index) => (
              <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '1.1rem', color: '#475569' }}>
                <input 
                  type="checkbox" 
                  value={opt.label} 
                  onChange={handleOptionChange} 
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} 
                />
                {opt.label} {opt.price > 0 ? `(+$${opt.price})` : ''}
              </label>
            ))}
          </div>
        )}

        {/* ส่วนของ Textbox สำหรับคำขอพิเศษ (แสดงทุกเมนูเหมือนเดิม) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ margin: 0, color: '#102a42', fontSize: '1.2rem', marginBottom: '0.8rem' }}>คำขอพิเศษ:</h4>
          <textarea 
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="เช่น ไม่เผ็ด, แยกน้ำยำ, ขอช้อนส้อมเพิ่ม..."
            style={{ 
              width: '100%', 
              minHeight: '80px', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1', 
              fontFamily: 'inherit', 
              fontSize: '1rem',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <span style={{ fontWeight: 'bold', color: '#102a42', fontSize: '1.1rem' }}>จำนวน:</span>
          <button onClick={handleDecrease} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1.2rem', borderRadius: '5px', border: '1px solid #cbd5e1', background: 'white' }}>-</button>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#102a42', width: '2rem', textAlign: 'center' }}>{quantity}</span>
          <button onClick={handleIncrease} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1.2rem', borderRadius: '5px', border: '1px solid #cbd5e1', background: 'white' }}>+</button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handleAddToCart} className="filter-btn" style={{ background: '#c2410c', color: 'white', flex: '1 1 200px', padding: '0.75rem', fontSize: '1.1rem', margin: 0 }}>
            เพิ่มลงในตะกร้า
          </button>
          <button onClick={() => navigate('/')} className="filter-btn" style={{ flex: '1 1 200px', padding: '0.75rem', fontSize: '1.1rem', margin: 0 }}>
            กลับหน้าเมนู
          </button>
        </div>

      </div>
    </div>
  );
};

export default FoodDetail;