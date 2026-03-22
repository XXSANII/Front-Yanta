import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Navbar ถูกย้ายออกมาไว้นอก <main> แล้ว เพื่อให้ติดขอบบนสุด */}
        <nav style={{ padding: '1rem 2rem', background: '#102a42', display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Cart
          </Link>
        </nav>

        {/* <main> จะรับหน้าที่ครอบเฉพาะส่วนเนื้อหาที่เปลี่ยนไปมา (Pages) */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:id" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;