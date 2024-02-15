import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { Homepage } from '../src/components/Homepage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SignUp } from './pages/SignUp';
import { LogIn} from './pages/LogIn';
import { App } from './App'; 
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './store/store';
import { Navigate } from 'react-router-dom';
import { setToken } from './store/tokenSlice'
import './css/Header.css'
import './css/Main.css'
import './css/Carousal.css'
import './css/FilterBar.css'
import './css/Podcast-Preview.css'
import './css/Footer.css'
import './css/favoritesPage.css'
import './css/SignUp.css'
import './css/LogIn.css'

const AppRouter = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token);

  //  {token !== null && <Route path="/pages/SignUp" element={<SignUp />} />}
  // {token === null && <Route path="/" element={<Homepage />} />}
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/pages/FavoritesPage" element={<FavoritesPage />} />
      <Route path="/pages/LogIn" element={<LogIn />} />
      <Route path="/pages/SignUp" element={<SignUp />} />
      <Route path="/components/Homepage" element={<Homepage />} />
      
    </Routes>
  </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);