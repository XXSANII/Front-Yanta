import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../../firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, query, orderBy, getDocs, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  // --- 1. States สำหรับจัดการเมนู ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newFood, setNewFood] = useState({ title: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [options, setOptions] = useState([]); // สำหรับหน้าเพิ่มใหม่
  const [optLabel, setOptLabel] = useState('');
  const [optPrice, setOptPrice] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // --- 2. States สำหรับการแก้ไข ---
  const [editingItem, setEditingItem] = useState(null);

  // --- 3. States สำหรับ QR Code ---
  const [tableCount, setTableCount] = useState(5);
  const baseUrl = window.location.origin;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
      else setIsChecking(false);
    });
    const qProduct = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeProduct = onSnapshot(qProduct, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubscribeCat = onSnapshot(collection(db, "categories"), (snapshot) => {
      setCategories(snapshot.docs.map(d => d.data().name));
    });
    return () => { unsubscribeAuth(); unsubscribeProduct(); unsubscribeCat(); };
  }, [navigate]);

  // ฟังก์ชันเพิ่ม Option สำหรับ "หน้าเพิ่มใหม่"
  const handleAddOption = () => {
    if (!optLabel) return;
    setOptions([...options, { label: optLabel, price: Number(optPrice) || 0 }]);
    setOptLabel(''); setOptPrice('');
  };

  // ฟังก์ชันเพิ่ม Option สำหรับ "หน้าแก้ไข"
  const handleAddOptionEdit = () => {
    if (!optLabel) return;
    const updatedOptions = [...(editingItem.options || []), { label: optLabel, price: Number(optPrice) || 0 }];
    setEditingItem({...editingItem, options: updatedOptions});
    setOptLabel(''); setOptPrice('');
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("กรุณาเลือกรูป");
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `menus/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      const catName = newFood.category.trim();
      const catQuery = await getDocs(query(collection(db, "categories"), where("name", "==", catName)));
      if (catQuery.empty) await addDoc(collection(db, "categories"), { name: catName });

      await addDoc(collection(db, "products"), {
        ...newFood, category: catName, price: Number(newFood.price), img: url, 
        options, // บันทึก options ที่เพิ่มไว้
        createdAt: new Date()
      });
      setNewFood({ title: '', price: '', category: '' }); setOptions([]); setImageFile(null);
      alert("บันทึกสำเร็จ!");
    } catch (err) { alert(err.message); }
    finally { setIsUploading(false); }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImg = editingItem.img;
      if (imageFile) {
        const storageRef = ref(storage, `menus/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImg = await getDownloadURL(storageRef);
      }
      const productRef = doc(db, "products", editingItem.id);
      await updateDoc(productRef, {
        title: editingItem.title,
        price: Number(editingItem.price),
        category: editingItem.category,
        options: editingItem.options || [],
        img: finalImg
      });
      alert("อัปเดตสำเร็จ!");
      setEditingItem(null); setImageFile(null);
    } catch (err) { alert(err.message); }
    finally { setIsUploading(false); }
  };

  if (isChecking) return <div style={{textAlign:'center', padding:'50px'}}>กำลังตรวจสอบสิทธิ์...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Kanit", sans-serif' }}>
      
      {/* Header & Tabs (เหมือนเดิม) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>⚙️ ระบบจัดการร้าน Family Yanta</h2>
        <button onClick={() => signOut(auth)} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('menu')} style={{ padding: '10px 20px', background: activeTab === 'menu' ? '#1e293b' : 'none', color: activeTab === 'menu' ? 'white' : '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>จัดการเมนู</button>
        <button onClick={() => setActiveTab('qr')} style={{ padding: '10px 20px', background: activeTab === 'qr' ? '#1e293b' : 'none', color: activeTab === 'qr' ? 'white' : '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>สร้าง QR Code</button>
      </div>

      {activeTab === 'menu' && (
        <>
          {/* --- ฟอร์มเพิ่มเมนูใหม่ --- */}
          {!editingItem && (
            <form onSubmit={addProduct} style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
              <h3 style={{marginTop: 0}}>➕ เพิ่มเมนูใหม่</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <input type="text" placeholder="ชื่อเมนู" value={newFood.title} onChange={e => setNewFood({...newFood, title: e.target.value})} required style={{padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} />
                <input type="number" placeholder="ราคา" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})} required style={{padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} />
                <input list="cat-list" placeholder="ประเภท" value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})} required style={{padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} />
                <datalist id="cat-list">{categories.map(c => <option key={c} value={c} />)}</datalist>
              </div>

              {/* Option */}
              <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px dashed #cbd5e1' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>เพิ่มตัวเลือก (เช่น ไข่ดาว, เพิ่มเส้น)</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" placeholder="ชื่อตัวเลือก" value={optLabel} onChange={e => setOptLabel(e.target.value)} style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input type="number" placeholder="+ราคา" value={optPrice} onChange={e => setOptPrice(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <button type="button" onClick={handleAddOption} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer' }}>เพิ่ม</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {options.map((opt, i) => (
                    <span key={i} style={{ background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                      {opt.label} (+{opt.price}) 
                      <b onClick={() => setOptions(options.filter((_, idx)=>idx!==i))} style={{cursor:'pointer', marginLeft: '8px', color:'red'}}>×</b>
                    </span>
                  ))}
                </div>
              </div>

              <input type="file" onChange={e => setImageFile(e.target.files[0])} style={{marginBottom:'15px'}} />
              <button type="submit" disabled={isUploading} style={{ width: '100%', padding: '15px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                {isUploading ? "กำลังบันทึก..." : "บันทึกเมนูอาหาร"}
              </button>
            </form>
          )}

          {/* ตารางรายการเมนู (เหมือนเดิม) */}
          <h3>รายการเมนูปัจจุบัน ({products.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {products.map(item => (
              <div key={item.id} style={{ display: 'flex', background: 'white', padding: '15px', borderRadius: '18px', border: '1px solid #f1f5f9', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <img src={item.img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} alt="" />
                <div style={{ marginLeft: '15px', flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.category} | {item.price}.-</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setEditingItem(item)} style={{ color: '#3b82f6', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>แก้</button>
                  <button onClick={() => window.confirm("ลบเมนูนี้?") && deleteDoc(doc(db, "products", item.id))} style={{ color: '#ef4444', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ลบ</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---  แก้ไขเมนู (เพิ่มส่วนจัดการ Option) --- */}
      {editingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '25px', padding: '30px', maxHeight: '90vh', overflowY:'auto' }}>
            <h3 style={{ marginTop: 0 }}>✏️ แก้ไขเมนู</h3>
            <form onSubmit={updateProduct}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>ชื่อเมนู</label>
                <input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#666' }}>ราคา</label>
                  <input type="number" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#666' }}>ประเภท</label>
                  <input list="cat-edit" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                  <datalist id="cat-edit">{categories.map(c => <option key={c} value={c} />)}</datalist>
                </div>
              </div>

              {/* Option ใน Modal */}
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 10px 0', fontSize:'0.9rem' }}>🔘 จัดการตัวเลือกเดิม</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" placeholder="ชื่อ" value={optLabel} onChange={e => setOptLabel(e.target.value)} style={{ flex: 2, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input type="number" placeholder="+ราคา" value={optPrice} onChange={e => setOptPrice(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <button type="button" onClick={handleAddOptionEdit} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 12px', borderRadius: '8px' }}>เพิ่ม</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(editingItem.options || []).map((opt, i) => (
                    <span key={i} style={{ background: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', border: '1px solid #eee' }}>
                      {opt.label} (+{opt.price}) 
                      <b onClick={() => setEditingItem({...editingItem, options: editingItem.options.filter((_, idx)=>idx!==i)})} style={{cursor:'pointer', marginLeft: '6px', color:'red'}}>×</b>
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>รูปภาพใหม่ (ถ้าไม่เปลี่ยนให้เว้นว่าง)</label>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>ยกเลิก</button>
                <button type="submit" disabled={isUploading} style={{ flex: 1, padding: '12px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isUploading ? "บันทึก..." : "อัปเดตข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ส่วน QR Code (เหมือนเดิม) */}
      {activeTab === 'qr' && (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid #eee' }}>
          <h3>🔢 กำหนดจำนวนโต๊ะ</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
            <input type="number" value={tableCount} onChange={(e) => setTableCount(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', width: '100px', textAlign: 'center' }} />
            <button onClick={() => window.print()} style={{ padding: '10px 25px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ พิมพ์ QR ทั้งหมด</button>
          </div>
          <div id="qr-print-area" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {[...Array(Number(tableCount || 0))].map((_, i) => (
              <div key={i+1} style={{ padding: '20px', border: '1px solid #f1f5f9', borderRadius: '20px', background: '#fafafa' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>โต๊ะ {i+1}</h4>
                <QRCodeCanvas value={`${baseUrl}/?table=${i+1}`} size={140} level="H" includeMargin={true} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #qr-print-area, #qr-print-area * { visibility: visible; }
          #qr-print-area { position: absolute; left: 0; top: 0; width: 100%; display: grid !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;