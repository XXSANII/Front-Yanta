import React, { useState } from 'react';
import items from '../data';
import MenuList from '../components/MenuList';
import Navbar from '../components/Navbar';

const allCategories = ['all', ...new Set(items.map((item) => item.category))];

function Home() {
  const [menuItems, setMenuItems] = useState(items);
  const [categories, setCategories] = useState(allCategories);

  const filterItems = (category) => {
    if (category === 'all') {
      setMenuItems(items);
      return;
    }
    const newItems = items.filter((item) => item.category === category);
    setMenuItems(newItems);
  };

  return (
    <section className="menu section">
      <div className="title">
        <h2>Menu</h2>
        <div className="underline"></div>
      </div>
      <Navbar categories={categories} filterItems={filterItems} />
      <MenuList items={menuItems} />
    </section>
  );
}

export default Home;