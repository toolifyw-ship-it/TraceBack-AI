import './index.css'; // If you have a CSS file, otherwise you can remove this line

// Initialize your Trace UI
const initializeApp = () => {
  const initButton = document.querySelector('button');
  if (initButton) {
    initButton.addEventListener('click', () => {
      alert("Traceback AI System Initialized Successfully!");
    });
  }
};

document.addEventListener('DOMContentLoaded', initializeApp);