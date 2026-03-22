import React from 'react';
import { Link } from 'react-router-dom';

// เพิ่มการรับค่า id เข้ามา
const MenuCard = ({ id, title, img, price, desc }) => {
  return (
    // ใช้ Link คลุมการ์ดทั้งหมด และชี้ไปที่ /item/ไอดีของอาหาร
    <Link to={`/item/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="menu-card" style={{ cursor: 'pointer' }}>
        <img src={img} alt={title} className="menu-img" />
        <div className="item-info">
          <header className="item-header">
            <h4>{title}</h4>
            <h4 className="price">${price}</h4>
          </header>
          <p className="item-text">{desc}</p>
        </div>
      </article>
    </Link>
  );
};

export default MenuCard;