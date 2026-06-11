import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App.tsx' // এটি সরাসরি src ফোল্ডারের App.tsx কে লিঙ্ক করবে
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)