import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import ฝั่งลูกค้า
import Home from './pages/customer/Home';

// Import ฝั่งร้าน (Admin)
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard'; // หน้าจัดการเมนู
import OrderList from './pages/admin/OrderList'; // หน้าจอรับออเดอร์

function App() {
  return (
    <Router>
      <Routes>
        {/* หน้าหลักลูกค้า */}
        <Route path="/" element={<Home />} />

        {/* ระบบหลังบ้าน */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/orders" element={<OrderList />} />
      </Routes>
    </Router>
  );
}

export default App;