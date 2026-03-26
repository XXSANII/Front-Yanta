import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || "กลับบ้าน";

  // 🟢 1. เปลี่ยนจาก Array คงที่ เป็น State เพื่อดึงจาก Firebase
  const [categories, setCategories] = useState([{ id: 'all', label: 'ทั้งหมด' }]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Modal States
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    // 🟢 2. ดึงหมวดหมู่จาก Collection "categories" ที่เราพิมพ์เพิ่มจาก Dashboard
    const unsubscribeCat = onSnapshot(collection(db, "categories"), (snapshot) => {
      const catsFromDB = snapshot.docs.map(doc => ({
        id: doc.data().name,   // ใช้ชื่อที่พิมพ์เป็น ID ในการเช็ก filter
        label: doc.data().name // ใช้ชื่อที่พิมพ์โชว์บนปุ่ม
      }));
      setCategories([{ id: 'all', label: 'ทั้งหมด' }, ...catsFromDB]);
    });

    // 3. ดึงรายการอาหาร
    const qProduct = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeProduct = onSnapshot(qProduct, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubscribeCat(); unsubscribeProduct(); };
  }, []);

  const handleAddToCart = () => {
    const totalOptionPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const orderItem = {
      cartId: Date.now(),
      title: selectedFood.title,
      basePrice: selectedFood.price,
      options: selectedOptions,
      qty: quantity,
      totalItemPrice: (selectedFood.price + totalOptionPrice) * quantity,
      note: note
    };
    setCart([...cart, orderItem]);
    setSelectedFood(null);
    setSelectedOptions([]);
    setQuantity(1);
    setNote("");
  };

  const confirmOrder = async () => {
    if (cart.length === 0) return;
    if (!window.confirm(`ยืนยันการสั่งอาหารสำหรับ ${tableNumber}?`)) return;

    try {
      await addDoc(collection(db, "orders"), {
        tableId: tableNumber,
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + item.totalItemPrice, 0),
        status: "pending",
        createdAt: serverTimestamp()
      });
      alert("🚀 สั่งอาหารสำเร็จ!");
      setCart([]);
    } catch (e) { alert(e.message); }
  };

  const colors = {
    primary: '#059669',
    secondary: '#1e293b',
    bg: '#f1f5f9',
    white: '#ffffff'
  };

  return (
    <div style={{ padding: '15px', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Kanit", sans-serif', backgroundColor: colors.bg, minHeight: '100vh', paddingBottom: '120px' }}>
      
      {/* CSS Injection สำหรับ Responsive เหมือนเดิม */}
      <style>{`
        .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
        .modal-content { width: 100%; max-width: 500px; margin: 0 auto; }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '20px', background: colors.white, padding: '20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: colors.secondary, margin: '0 0 10px 0', fontSize: '1.6rem' }}>🍜 Family Yanta</h1>
        <div style={{ display: 'inline-block', background: colors.primary, color: 'white', padding: '6px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          📍 โต๊ะที่: {tableNumber}
        </div>
      </header>

      {/* 🟢 Category Tabs (ปุ่มจะเพิ่มขึ้นตามที่คุณพิมพ์ใน Dashboard) */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '10px 22px', borderRadius: '15px', border: 'none',
              background: activeCategory === cat.id ? colors.primary : colors.white,
              color: activeCategory === cat.id ? 'white' : colors.secondary,
              fontWeight: 'bold', whiteSpace: 'nowrap', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 🟢 Product List (หัวข้อจะเปลี่ยนตามชื่อหมวดหมู่ที่คุณพิมพ์) */}
      <div>
        {categories.filter(c => c.id !== 'all').map(cat => {
          const categoryItems = items.filter(item => item.category === cat.id);
          
          if ((activeCategory === 'all' || activeCategory === cat.id) && categoryItems.length > 0) {
            return (
              <div key={cat.id} style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '18px' }}>
                  <span style={{ color: colors.secondary, fontWeight: '800', fontSize: '1.1rem' }}>{cat.label}</span>
                  <div style={{ height: '2px', flex: 1, background: '#e2e8f0' }}></div>
                </div>

                <div className="product-grid">
                  {categoryItems.map(food => (
                    <div key={food.id} onClick={() => setSelectedFood(food)} style={{ background: colors.white, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
                      <img src={food.img} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      <div style={{ padding: '15px' }}>
                        <div style={{ fontWeight: 'bold', color: colors.secondary, fontSize: '1rem', marginBottom: '6px' }}>{food.title}</div>
                        <div style={{ color: colors.primary, fontWeight: '900', fontSize: '1.1rem' }}>{food.price}.-</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* --- Modal (เหมือนเดิม) --- */}
      {selectedFood && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, padding: '0 10px' }}>
          <div className="modal-content" style={{ background: 'white', borderRadius: '30px 30px 0 0', padding: '25px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0 }}>{selectedFood.title}</h2>
              <button onClick={() => setSelectedFood(null)} style={{ border: 'none', background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>
            <img src={selectedFood.img} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '24px', marginBottom: '20px' }} />
            
            {/* Options Checkbox */}
            {selectedFood.options && selectedFood.options.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: 'bold' }}>ตัวเลือกเพิ่มเติม</p>
                {selectedFood.options.map((opt, i) => (
                  <label key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #f1f5f9', borderRadius: '15px', marginBottom: '10px', cursor: 'pointer' }}>
                    <span>{opt.label} (+{opt.price}.-)</span>
                    <input type="checkbox" style={{ accentColor: colors.primary }} onChange={(e) => {
                      if(e.target.checked) setSelectedOptions([...selectedOptions, opt]);
                      else setSelectedOptions(selectedOptions.filter(o => o.label !== opt.label));
                    }} />
                  </label>
                ))}
              </div>
            )}

            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontWeight: 'bold' }}>หมายเหตุถึงร้าน</p>
              <input type="text" placeholder="เช่น เผ็ดน้อย" value={note} onChange={(e) => setNote(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '40px', padding: '6px' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity-1))} style={{ width: '45px', height: '45px', border: 'none', background: 'white', borderRadius: '50%', fontWeight: 'bold' }}>-</button>
                <span style={{ padding: '0 20px', fontWeight: 'bold', fontSize: '1.3rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity+1)} style={{ width: '45px', height: '45px', border: 'none', background: 'white', borderRadius: '50%', fontWeight: 'bold' }}>+</button>
              </div>
              <button onClick={handleAddToCart} style={{ flex: 1, padding: '18px', background: colors.primary, color: 'white', border: 'none', borderRadius: '40px', fontWeight: 'bold' }}>
                เพิ่ม {(selectedFood.price + selectedOptions.reduce((s,o)=>s+o.price,0))*quantity}.-
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Floating Bottom Bar (เหมือนเดิม) --- */}
      {cart.length > 0 && (
        <div style={{ position: 'fixed', bottom: '25px', left: '15px', right: '15px', maxWidth: '600px', margin: '0 auto', background: colors.secondary, color: 'white', padding: '18px 25px', borderRadius: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', zIndex: 999 }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: colors.primary }}>{cart.reduce((s, i) => s + i.totalItemPrice, 0)}.-</div>
          </div>
          <button onClick={confirmOrder} style={{ background: colors.primary, color: 'white', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            ยืนยันการสั่ง 🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;