import React from 'react';
import MenuCard from './MenuCard';

const MenuList = ({ items }) => {
  return (
    <div className="section-center">
      {items.map((menuItem) => {
        // ส่งข้อมูลทีละชุดเข้าไปใน MenuCard
        return <MenuCard key={menuItem.id} {...menuItem} />;
      })}
    </div>
  );
};

export default MenuList;