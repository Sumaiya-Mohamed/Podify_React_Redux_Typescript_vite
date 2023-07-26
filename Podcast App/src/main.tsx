import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { FavoritesPage } from './components/FavoritesPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store.ts';
import './css/Header.css'
import './css/Main.css'
import './css/Carousal.css'
import './css/FilterBar.css'
import './css/Podcast-Preview.css'
import './css/Footer.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Other existing routes */}
        <Route path="/components/FavoritesPage" element={<FavoritesPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
</React.StrictMode>,
)