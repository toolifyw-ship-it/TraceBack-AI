import React from 'react';

export default function App() {
  return (
    <div style={{ backgroundColor: '#07080a', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif', padding: '20px' }}>
      {/* হেডার বার */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>TRACE-BACK-AI</div>
        <button style={{ backgroundColor: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '5px', color: '#fff' }}>SECURE SESSION</button>
      </div>

      {/* মূল বডি */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px' }}>Audit Your <span style={{ color: '#818cf8' }}>Digital Footprint</span></h1>
        <p style={{ color: '#64748b' }}>Verify digital leaks and exposure records.</p>
        <input style={{ width: '100%', padding: '15px', marginTop: '20px', borderRadius: '10px', backgroundColor: '#0f1115', color: '#fff' }} placeholder="Enter Email..." />
        <button style={{ width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#4f46e5', borderRadius: '10px', color: '#fff', border: 'none' }}>INITIALIZE TRACE</button>
      </div>
    </div>
  );
}