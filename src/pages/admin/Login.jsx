import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin'); 
    } catch (error) {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้องครับ");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e293b' }}>🔐 Admin Login</h2>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

export default Login;