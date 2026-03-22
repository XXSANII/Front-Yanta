import React, { useState } from 'react';
import items from './data';
import MenuList from './components/MenuList';
import Navbar from './components/Navbar';
import './App.css'; // อย่าลืม import CSS นะครับ

// ดึงหมวดหมู่ออกมาแบบไม่ซ้ำกัน (เช่น all, breakfast, lunch)
const allCategories = ['all', ...new Set(items.map((item) => item.category))];

function App() {
  const [menuItems, setMenuItems] = useState(items);
  const [categories, setCategories] = useState(allCategories);

  // ฟังก์ชันกรองเมนูอาหาร
  const filterItems = (category) => {
    if (category === 'all') {
      setMenuItems(items);
      return;
    }
    const newItems = items.filter((item) => item.category === category);
    setMenuItems(newItems);
  };

  return (
    <main>
      <section className="menu section">
        <div className="title">
          <h2>Our Menu</h2>
          <div className="underline"></div>
        </div>
        
        {/* ส่ง categories และฟังก์ชัน filterItems ไปที่ Navbar */}
        <Navbar categories={categories} filterItems={filterItems} />
        
        {/* ส่งข้อมูลอาหารที่กรองแล้วไปแสดงผล */}
        <MenuList items={menuItems} />
      </section>
    </main>
  );
}

export default App;