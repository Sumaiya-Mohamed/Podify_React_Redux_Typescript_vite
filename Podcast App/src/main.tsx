import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './css/Header.css'
import './css/Main.css'
import './css/Carousal.css'
import './css/FilterBar.css'
import './css/Podcast-Preview.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
