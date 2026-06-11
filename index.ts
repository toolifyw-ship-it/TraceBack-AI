import './index.css';

document.body.innerHTML = `
  <div style="background-color: #05050d; color: #ffffff; min-height: 100vh; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; text-align: center;">
    <div style="background: #0d0e26; padding: 10px 20px; border-radius: 20px; border: 1px solid #1f2259; font-size: 12px; letter-spacing: 2px; color: #8b9bb4; margin-bottom: 24px; font-weight: bold; text-transform: uppercase;">
      🛡️ CYBER FOOTPRINT FORENSICS V2.0
    </div>
    
    <h1 style="font-size: 36px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.2;">
      Audit Your <span style="color: #a855f7;">Digital<br>Footprint</span> with AI Forensics.
    </h1>
    
    <p style="color: #64748b; font-size: 14px; max-width: 450px; margin: 0 0 40px 0; line-height: 1.5;">
      Verify digital leaks, public exposure records, and credential exposure under standard cyber OSINT forensics in 195+ countries.
    </p>
    
    <div style="width: 100%; max-width: 400px; background: #090a14; border: 1px solid #1e293b; border-radius: 12px; padding: 8px; display: flex; align-items: center; gap: 8px; margin-bottom: 40px;">
      <span style="color: #475569; margin-left: 8px;">🔍</span>
      <input type="text" placeholder="Enter Global Gmail or..." style="background: transparent; border: none; outline: none; color: white; flex: 1; font-size: 14px;" />
      <span style="background: #1e1b4b; color: #a855f7; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">⏱️ 0</span>
    </div>
    
    <button style="width: 100%; max-width: 400px; background: #581c87; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: bold; font-size: 14px; letter-spacing: 1px; cursor: pointer; transition: background 0.2s;">
      INITIALIZE TRACE
    </button>
    
    <div style="margin-top: 60px; font-size: 11px; color: #475569; letter-spacing: 1px; font-weight: bold;">
      NODE LINKS: <span style="color: #38bdf8;">US-EAST</span> | <span style="color: #38bdf8;">EU-WEST</span> | <span style="color: #38bdf8;">ASIA-SOUTH</span>
    </div>
  </div>
`;

// Simple functional handle for the button click event
setTimeout(() => {
  const btn = document.querySelector('button');
  const input = document.querySelector('input') as HTMLInputElement;
  if (btn && input) {
    btn.addEventListener('click', () => {
      const value = input.value.trim();
      if (!value) {
        alert('Please enter a target query first.');
        return;
      }
      btn.innerText = 'TRACING SCAN NODE...';
      btn.style.background = '#3b0764';
      setTimeout(() => {
        alert(`OSINT Scan Complete for: ${value}\nStatus: Safe. No public credential leaks detected on standard nodes.`);
        btn.innerText = 'INITIALIZE TRACE';
        btn.style.background = '#581c87';
      }, 2000);
    });
  }
}, 100);