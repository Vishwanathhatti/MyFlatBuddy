import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />    
    <Toaster position='top-right' duration={2000} richColors />
    </BrowserRouter>
  </StrictMode>,
)
