import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './index.ts' // এখানে আমরা সিস্টেমকে বলে দিলাম আসল কোড index.ts ফাইলের ভেতরে আছে
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)