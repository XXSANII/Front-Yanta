import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['ทั้งหมด']);
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [loading, setLoading] = useState(true);

  // 🟢 ดึงข้อมูลจาก Firebase ทันทีที่โหลดหน้าเว็บ
  useEffect(() => {
    // ดึงเฉพาะเมนูที่เปิดขายอยู่ (status: true)
    const q = query(collection(db, 'products'), where('status', '==', true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);

      // ดึงรายชื่อหมวดหมู่ที่ไม่ซ้ำกันออกมาสร้างปุ่ม
      const uniqueCategories = ['ทั้งหมด', ...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filterItems = (category) => {
    setActiveCategory(category);
  };

  // กรองเมนูที่จะแสดงตามปุ่มที่ลูกค้ากด
  const displayedItems = activeCategory === 'ทั้งหมด' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '5rem', color: '#102a42' }}>กำลังโหลดเมนูอาหาร... 🍳</h2>;
  }

  return (
    <main style={{ padding: '2rem 0' }}>
      <section className="menu section">
        <div className="title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#102a42', fontSize: '2.5rem', marginBottom: '0.5rem' }}>เมนูอาหารของเรา</h2>
          <div style={{ width: '5rem', height: '0.25rem', background: '#c2410c', margin: '0 auto' }}></div>
        </div>

        {/* ปุ่มเลือกหมวดหมู่ */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', padding: '0 1rem' }}>
          {categories.map((category, index) => (
            <button
              type="button"
              key={index}
              onClick={() => filterItems(category)}
              style={{ 
                background: activeCategory === category ? '#c2410c' : 'white',
                color: activeCategory === category ? 'white' : '#c2410c',
                border: '2px solid #c2410c',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {category === 'breakfast' ? 'อาหารเช้า' : category === 'dimsum' ? 'ติ่มซำ' : category === 'drinks' ? 'เครื่องดื่ม' : category}
            </button>
          ))}
        </div>

        {/* รายการอาหาร */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {displayedItems.length === 0 ? (
            <h3 style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#64748b' }}>ยังไม่มีเมนูในหมวดหมู่นี้ครับ</h3>
          ) : (
            displayedItems.map((item) => {
              const { id, title, img, price, desc } = item;
              return (
                <article key={id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                  <img 
                    // ถ้ารูปไม่มี ให้ใช้รูปตัวอย่าง
                    src={img || 'https://images.unsplash.com/photo-1495474472201-411db1cd92b5?w=500&q=80'} 
                    alt={title} 
                    style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dotted #e2e8f0', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.3rem', color: '#102a42', fontWeight: 'bold' }}>{title}</h4>
                      <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '1.3rem', fontWeight: 'bold' }}>{price} บ.</h4>
                    </header>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                      {desc || 'เมนูแนะนำจากทางร้าน ทำสดใหม่ทุกวัน'}
                    </p>
                    <Link 
                      to={`/item/${id}`} 
                      style={{ display: 'block', textAlign: 'center', background: '#102a42', color: 'white', textDecoration: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                      สั่งอาหาร
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;