import React from 'react';

export default function App() {
  return (
    <div style={{ 
      backgroundColor: '#07080a', 
      minHeight: '100vh', 
      color: '#ffffff', 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      
      {/* 🎯 Top Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#090a0f',
        borderBottom: '1px solid #1f2937',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            backgroundColor: '#3b82f6', 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🧬
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px', letterSpacing: '0.5px' }}>TRACE-BACK-AI</div>
            <div style={{ color: '#6366f1', fontSize: '10px', fontWeight: 'bold' }}>GLOBAL NODE</div>
          </div>
        </div>
        
        <button style={{
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(79, 70, 229, 0.5)'
        }}>
          SECURE SESSION
        </button>
      </div>

      {/* 🚀 Main Content */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '60px 20px', 
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        
        <div style={{ border: '1px solid #1e293b', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', color: '#818cf8', backgroundColor: '#0f172a', fontWeight: '600', letterSpacing: '1px', marginBottom: '24px' }}>
          🛡️ CYBER FOOTPRINT FORENSICS V2.0
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
          Audit Your <span style={{ color: '#818cf8' }}>Digital Footprint</span> with AI Forensics.
        </h1>

        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
          Verify digital leaks, public exposure records, and credential exposure under standard cyber OSINT forensics in 195+ countries.
        </p>

        <div style={{ width: '100%', position: 'relative', marginBottom: '16px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Enter Global Gmail or..." 
            style={{ width: '100%', backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px 16px 16px 48px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '40px' }}>
          INITIALIZE TRACE
        </button>

        <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px' }}>
          NODE LINKS: US-EAST | EU-WEST | ASIA-SOUTH
        </div>
      </div>
    </div>
  );
}