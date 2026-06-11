import React from 'react';

export default function App() {
  return (
    <div style={{ backgroundColor: '#07080a', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 🎯 Top Header Bar matching Google AI Studio */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        backgroundColor: '#0c0d12',
        borderBottom: '1px solid #1a1c23',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Global Node Icon */}
          <div style={{ 
            backgroundColor: '#3b82f6', 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
          }}>
            🌐
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px', lineHeight: '1.2' }}>TRACE-BACK-AI</div>
            <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px' }}>GLOBAL NODE</div>
          </div>
        </div>
        
        {/* Secure Session Button */}
        <button style={{
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)'
        }}>
          SECURE SESSION
        </button>
      </div>

      {/* 🚀 Main Website Body Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 20px', textAlign: 'center', maxWidth: '500px' }}>
        
        <div style={{ border: '1px solid #1e293b', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', color: '#818cf8', backgroundColor: '#0f172a', fontWeight: '600', letterSpacing: '1px', marginBottom: '24px' }}>
          🛡️ CYBER FOOTPRINT FORENSICS V2.0
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2', letterSpacing: '-0.5px' }}>
          Audit Your <span style={{ color: '#818cf8' }}>Digital Footprint</span> with AI Forensics.
        </h1>

        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '32px' }}>
          Verify digital leaks, public exposure records, and credential exposure under standard cyber OSINT forensics in 195+ countries.
        </p>

        {/* Search Input Box */}
        <div style={{ width: '100%', position: 'relative', marginBottom: '16px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '16px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Enter Global Gmail or..." 
            style={{ width: '100%', backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px 16px 14px 44px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#1e1b4b', color: '#818cf8', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>⏱️ 0</span>
        </div>

        {/* Initialize Trace Button */}
        <button style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px', marginBottom: '40px', boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)' }}>
          INITIALIZE TRACE
        </button>

        {/* Footer Node Links */}
        <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px' }}>
          NODE LINKS: <span style={{ color: '#3b82f6' }}>US-EAST</span> | <span style={{ color: '#3b82f6' }}>EU-WEST</span> | <span style={{ color: '#3b82f6' }}>ASIA-SOUTH</span>
        </div>

      </div>
    </div>
  );
}