import { StrictMode } from 'react'

console.log(
  '%c hey, i see you in here 👀',
  'color: #60a5fa; font-size: 16px; font-weight: bold; font-family: monospace;'
)
console.log(
  '%c i\'m open to work — github.com/tren03',
  'color: #9ca3af; font-size: 12px; font-family: monospace;'
)
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
