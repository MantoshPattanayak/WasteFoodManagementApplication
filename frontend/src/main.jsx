import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import instance from '../env.js';

if (instance().APPLICATION_MODE == 'production') {
  createRoot(document.getElementById('root')).render(
    <App />,
  )
}
else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
