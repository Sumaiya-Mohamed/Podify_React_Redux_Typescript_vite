import React from 'react';
import { useNavigate } from "react-router-dom"


export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useHistory

  const backToHome = () => {
    // When the button is clicked, navigate to the main page (assuming the main page is at '/')
    navigate('/');
   };


  return (
    <div>
      <div className="header__container">
            <div className="left__elements">
              <img className="podcast__img" src="./src/assets/mic.png" alt="mic icon"></img>
              <h1 className="podcast__name">Podify</h1>
            </div>
            <div className="right__elements">
             <button 
             onClick={backToHome}
             className="favorites__button"
             >
              Back
             </button>
            </div>
        </div>
    </div>
  );
};