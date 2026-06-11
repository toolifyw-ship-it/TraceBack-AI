import React from 'react';

export default function App() {
  return (
    <div style={{ backgroundColor: '#07080a', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif' }}>
      {/* হেডার বার */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ fontWeight: 'bold' }}>TRACE-BACK-AI</div>
        <button style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px' }}>SECURE SESSION</button>
      </div>

      {/* মূল বডি */}
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '32px' }}>Audit Your Digital Footprint</h1>
        <input style={{ width: '80%', padding: '15px', borderRadius: '10px', backgroundColor: '#0f1115', color: '#fff', border: '1px solid #333' }} placeholder="Enter Email..." />
        <br />
        <button style={{ width: '80%', padding: '15px', marginTop: '15px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px' }}>INITIALIZE TRACE</button>
      </div>
    </div>
  );
}