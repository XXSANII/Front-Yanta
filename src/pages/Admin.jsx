import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState(null);

  // Form States
  const [newFood, setNewFood] = useState({ title: '', price: '', category: 'breakfast' });
  const [imageFile, setImageFile] = useState(null);
  const [options, setOptions] = useState([]);
  const [optLabel, setOptLabel] = useState('');
  const [optPrice, setOptPrice] = useState('');

  useEffect(() => {
    // 1. ตรวจสอบการล็อกอิน
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    
    // 2. ดึงข้อมูลเมนู
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, [navigate]);

  const handleAddOption = () => {
    if (!optLabel) return;
    setOptions([...options, { label: optLabel, price: Number(optPrice) || 0 }]);
    setOptLabel('');
    setOptPrice('');
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("กรุณาเลือกรูปภาพก่อนครับ");
    
    setIsUploading(true);
    try {
      // อัปโหลดรูปลง Firebase Storage
      const storageRef = ref(storage, `menus/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imgUrl = await getDownloadURL(storageRef);

      // บันทึกข้อมูลลง Firestore
      await addDoc(collection(db, "products"), {
        ...newFood,
        price: Number(newFood.price),
        img: imgUrl,
        status: true,
        options: options,
        createdAt: new Date()
      });

      alert("เพิ่มเมนูสำเร็จ!");
      setNewFood({ title: '', price: '', category: 'breakfast' });
      setImageFile(null);
      setOptions([]);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return <div style={{textAlign: 'center', marginTop: '50px'}}>กำลังตรวจสอบสิทธิ์...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{margin: 0}}>⚙️ Admin Management</h2>
        <button onClick={() => signOut(auth)} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>ออกจากระบบ</button>
      </div>

      <form onSubmit={addProduct} style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <input type="text" placeholder="ชื่อเมนู" value={newFood.title} onChange={e => setNewFood({...newFood, title: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}} />
          <input type="number" placeholder="ราคา" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}} />
          <select value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})} style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}>
            <option value="breakfast">อาหารเช้า</option>
            <option value="dimsum">ติ่มซำ</option>
            <option value="drinks">เครื่องดื่ม</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>เลือกรูปภาพ:</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{width: '100%'}} />
        </div>

        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
          <label><b>เพิ่มตัวเลือก (Options):</b></label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            <input type="text" placeholder="เช่น ไข่ดาว" value={optLabel} onChange={e => setOptLabel(e.target.value)} style={{flex: 1, padding: '5px'}} />
            <input type="number" placeholder="+0" value={optPrice} onChange={e => setOptPrice(e.target.value)} style={{width: '60px', padding: '5px'}} />
            <button type="button" onClick={handleAddOption} style={{background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px'}}>เพิ่ม</button>
          </div>
          <div style={{marginTop: '10px', fontSize: '0.9rem'}}>
            {options.map((opt, i) => <span key={i} style={{marginRight: '10px', background: '#e2e8f0', padding: '2px 8px', borderRadius: '10px'}}>{opt.label} (+{opt.price})</span>)}
          </div>
        </div>

        <button type="submit" disabled={isUploading} style={{ width: '100%', padding: '12px', background: isUploading ? '#94a3b8' : '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isUploading ? 'กำลังบันทึกข้อมูล...' : '💾 บันทึกเมนู'}
        </button>
      </form>

      <h3>รายการเมนูทั้งหมด ({products.length})</h3>
      {products.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={item.img} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
            <span><b>{item.title}</b> ({item.price}.-)</span>
          </div>
          <button onClick={() => deleteDoc(doc(db, "products", item.id))} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>ลบ</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;