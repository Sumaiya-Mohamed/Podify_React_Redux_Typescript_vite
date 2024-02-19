import { Link } from 'react-router-dom';
import { supabase } from '../Client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addId, resetId} from '../store/IdSlice';
import { resetToken } from '../store/tokenSlice';
import { useNavigate } from 'react-router-dom';


export const NavBar = ({setPage}) => {
  const token = useSelector((state: RootState) => state.token)
  const user = useSelector((state: RootState) => state.userData)
  const dispatch = useDispatch();
  const navigate = useNavigate()
 
  const removeIdAndToken = () =>{
    
    dispatch(resetId());
    dispatch(resetToken())
    navigate('/')
    
  }

  const goToHome = () => {
    setPage('Home')
  }

  const goToLogIn = () => {
    setPage('LogIn')
  }

  const goToFavorites = () => {
    setPage('Favorites')
  }

    return(
        <div>
         
         <nav className="header__container">
            <div className="left__elements">
              <img className="podcast__img" src="../src/assets/mic.png" alt="mic icon"></img>
              <h1 className="podcast__name">Podify</h1>
            </div>
            <div className='nav__buttons'>
              <div className='home'>
               <img src='../icons/Home Page.png' alt='home icon' className='icon'></img>
               <h3
               onClick = {goToHome}
               >Home</h3>
              
              </div>
              <div className='user'>
              <img src='../icons/User.png' alt='user icon' className='icon'></img>
             <h3
             
              onClick = {goToLogIn}
             >Log In</h3>
              </div>
              <div className='bookmark'>
              <img src='../icons/Bookmark.png' alt='bookmark icon' className='icon'></img>
              <h3
             
              onClick = {goToFavorites}>
               Your Library</h3>
              </div>
               
            </div>
            </nav>
        </div>

    )
}