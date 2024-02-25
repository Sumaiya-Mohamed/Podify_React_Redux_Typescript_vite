import React, {useEffect} from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './store/store';
import './css/App.css'
import './css/NavBar.css'
import './css/Main.css'
import './css/Carousal.css'
import './css/FilterBar.css'
import './css/Podcast-Preview.css'
import './css/Footer.css'
import './css/favoritesPage.css'
import './css/SignUp.css'
import './css/LogIn.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);