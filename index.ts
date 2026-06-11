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
      width: '100%'
    }}>
      
      {/* 🎯 Top Header Bar Matching Image 2 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: '#090a0f',
        borderBottom: '1px solid #11131a',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            backgroundColor: '#3b82f6', 
            width: '36px', 
            height: '36px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🧬
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px' }}>TRACE-BACK-AI</div>
            <div style={{ color: '#6366f1', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>GLOBAL NODE</div>
          </div>
        </div>
        
        <button style={{
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)'
        }}>
          SECURE SESSION
        </button>
      </div>

      {/* 🚀 Main Website Full Screen Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '60px 24px', 
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Cyber Badge */}
        <div style={{ 
          border: '1px solid #1e293b', 
          padding: '8px 20px', 
          borderRadius: '20px', 
          fontSize: '12px', 
          color: '#818cf8', 
          backgroundColor: '#0f172a', 
          fontWeight: '600', 
          letterSpacing: '1px', 
          marginBottom: '32px' 
        }}>
          🛡️ CYBER FOOTPRINT FORENSICS V2.0
        </div>

        {/* Big Heading */}
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          marginBottom: '20px', 
          lineHeight: '1.2', 
          maxWidth: '600px' 
        }}>
          Audit Your <span style={{ color: '#818cf8' }}>Digital Footprint</span> with AI Forensics.
        </h1>

        {/* Paragraph Description */}
        <p style={{ 
          color: '#64748b', 
          fontSize: '15px', 
          lineHeight: '1.6', 
          marginBottom: '40px',
          maxWidth: '500px'
        }}>
          Verify digital leaks, public exposure records, and credential exposure under standard cyber OSINT forensics in 195+ countries.
        </p>

        {/* Large Input Area Container */}
        <div style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '18px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Enter Global Gmail or..." 
              style={{ 
                width: '100%', 
                backgroundColor: '#0f1115', 
                border: '1px solid #1e293b', 
                borderRadius: '12px', 
                padding: '16px 16px 16px 48px', 
                color: '#ffffff', 
                fontSize: '15px', 
                outline: 'none', 
                boxSizing: 'border-box' 
              }}
            />
            <span style={{ 
              position: 'absolute', 
              right: '18px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              backgroundColor: '#1e1b4b', 
              color: '#818cf8', 
              padding: '4px 10px', 
              borderRadius: '12px', 
              fontSize: '12px', 
              fontWeight: 'bold' 
            }}>⏱️ 0</span>
          </div>
        </div>

        {/* Wide Action Button */}
        <button style={{ 
          width: '100%', 
          maxWidth: '500px', 
          backgroundColor: '#4f46e5', 
          color: '#ffffff', 
          border: 'none', 
          borderRadius: '12px', 
          padding: '16px', 
          fontSize: '15px', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          letterSpacing: '1px', 
          marginBottom: '48px', 
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)' 
        }}>
          INITIALIZE TRACE
        </button>

        {/* Wide Footer Links */}
        <div style={{ 
          fontSize: '11px', 
          color: '#475569', 
          fontWeight: 'bold', 
          letterSpacing: '1.5px',
          marginTop: 'auto'
        }}>
          NODE LINKS: <span style={{ color: '#3b82f6' }}>US-EAST</span> | <span style={{ color: '#3b82f6' }}>EU-WEST</span> | <span style={{ color: '#3b82f6' }}>ASIA-SOUTH</span>
        </div>

      </div>
    </div>
  );
}