import './index.css';

// Initialize the Trace UI elements
document.addEventListener('DOMContentLoaded', () => {
  const initButton = document.querySelector('button');
  const inputField = document.querySelector('input');

  if (initButton && inputField) {
    initButton.addEventListener('click', async () => {
      const query = inputField.value.trim();
      if (!query) {
        alert('Please enter a Gmail or search query.');
        return;
      }

      initButton.innerText = 'TRACING...';
      initButton.disabled = true;

      try {
        // Fetch API key dynamically from Vercel environment
        const apiKey = (window as any)._env_?.VITE_GEMINI_API_KEY || "";
        
        // Mocking the AI response structure for the preview template
        setTimeout(() => {
          alert(`Trace completed for: ${query}\nNo critical exposure records found under standard cyber OSINT forensics.`);
          initButton.innerText = 'INITIALIZE TRACE';
          initButton.disabled = false;
        }, 2000);

      } catch (error) {
        console.error(error);
        alert('Trace sequence interrupted. Please check configurations.');
        initButton.innerText = 'INITIALIZE TRACE';
        initButton.disabled = false;
      }
    });
  }
});