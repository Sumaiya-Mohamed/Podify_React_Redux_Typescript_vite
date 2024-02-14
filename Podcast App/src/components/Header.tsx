import { Link } from 'react-router-dom';
import { supabase } from '../Client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addId, resetId} from '../store/IdSlice';
import { resetToken } from '../store/tokenSlice';
import { useNavigate } from 'react-router-dom';


export const Header = () => {
  const token = useSelector((state: RootState) => state.token)
  const id = useSelector((state: RootState) => state.id.id)
  const dispatch = useDispatch();
  const navigate = useNavigate()
 
  const removeIdAndToken = () =>{
    
    dispatch(resetId());
    dispatch(resetToken())
    navigate('/')
    
  }

    return(
        <div>
          {token || id !== ""? (
           <nav className="header__container">
            <div className="left__elements">
            <img className="podcast__img" src="../src/assets/mic.png" alt="mic icon"></img>
            <h1 className="podcast__name">Podify</h1>
          </div>
          <div className="right__elements">
          <Link to="../pages/FavoritesPage">
           <button 
           className="favorites__button"
           >
            Favorites
           </button>
          </Link>
          {id && <button className="favorites__button" onClick={removeIdAndToken}>Sign Out</button>}
          {token && <button className="favorites__button" onClick={removeIdAndToken}>Log Out</button>}
          </div>
          </nav>
          ) : (
            <nav className="header__container">
            <div className="left__elements">
              <img className="podcast__img" src="../src/assets/mic.png" alt="mic icon"></img>
              <h1 className="podcast__name">Podify</h1>
            </div>
            <div className="right__elements">
            <Link to="/pages/SignUp">
             <button className="SignIn__button">
               Sign Up
             </button>
            </Link>
            
            <Link to="./pages/LogIn">
             <button 
             className="LogIn__button"
             >
              Log In
             </button>
            </Link>
            </div>
            </nav>
          )}
            
        </div>

    )
}