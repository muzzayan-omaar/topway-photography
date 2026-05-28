import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@fontsource/inter";
import "@fontsource/cormorant-garamond";
import App from './App.jsx'
import WhatsApp from "./components/WhatsApp/WhatsApp";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <WhatsApp />
  </StrictMode>,
)
