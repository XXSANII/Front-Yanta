import React from 'react';

const MenuCard = ({ title, img, price, desc }) => {
  return (
    <article className="menu-card">
      <img src={img} alt={title} className="menu-img" />
      <div className="item-info">
        <header className="item-header">
          <h4>{title}</h4>
          <h4 className="price">${price}</h4>
        </header>
        <p className="item-text">{desc}</p>
      </div>
    </article>
  );
};

export default MenuCard;