
import { Link } from 'react-router-dom';


export const Header = () => {
  
    return(
        <div className="header__container">
            <div className="left__elements">
              <img className="podcast__img" src="../src/assets/mic.png" alt="mic icon"></img>
              <h1 className="podcast__name">Podify</h1>
            </div>
            <div className="right__elements">
            <Link to="./SignIn">
             <button className="SignIn__button">
               Sign In
             </button>
            </Link>
            <Link to="./components/FavoritesPage">
             <button 
             className="favorites__button"
             >
              Favorites
             </button>
            </Link>
            </div>
        </div>

    )
}