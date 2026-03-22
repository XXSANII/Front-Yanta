import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Kitchen = () => {
  const { orders, completeOrder } = useContext(CartContext);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', marginTop: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: '#b91c1c', marginBottom: '2rem', fontSize: '2.5rem' }}>
        👨‍🍳 ระบบหลังบ้าน (Kitchen Display)
      </h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.2rem' }}>ตอนนี้ยังไม่มีออเดอร์เข้าครับ ลุยพักผ่อนได้!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {orders.map((order) => (
            <div key={order.id} style={{ background: '#fff9c4', border: '2px solid #fbc02d', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              
              <div style={{ borderBottom: '2px dashed #fbc02d', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#102a42' }}>Order #{order.id.toString().slice(-4)}</h3>
                <span style={{ fontWeight: 'bold', color: '#c2410c' }}>{order.time}</span>
              </div>

              <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                {order.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #fde047' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#102a42' }}>
                      <span style={{ color: '#b91c1c' }}>{item.quantity}x</span> {item.title}
                    </div>
                    
                    {item.options && item.options.length > 0 && (
                      <div style={{ fontSize: '0.95rem', color: '#475569', marginLeft: '2rem' }}>
                        + {item.options.join(', ')}
                      </div>
                    )}
                    
                    {item.specialRequest && (
                      <div style={{ fontSize: '1rem', color: '#dc2626', marginLeft: '2rem', fontWeight: 'bold' }}>
                        * หมายเหตุ: {item.specialRequest}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => completeOrder(order.id)} 
                style={{ width: '100%', padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✅ ทำเสร็จแล้ว (Done)
              </button>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Kitchen;