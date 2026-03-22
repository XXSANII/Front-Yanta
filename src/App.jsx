import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import Kitchen from './pages/Kitchen';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <nav style={{ padding: '1rem 2rem', background: '#102a42', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/kitchen" style={{ color: '#fbc02d', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
            👨‍🍳 Kitchen
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
              🏠 Menu
            </Link>
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
              🛒 Cart
            </Link>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:id" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/kitchen" element={<Kitchen />} />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;