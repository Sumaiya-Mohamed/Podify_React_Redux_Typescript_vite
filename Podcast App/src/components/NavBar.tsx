

export const NavBar = ({setPage, page}) => {
 
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
              <img className="podcast__img" src="./public/mic.png" alt="mic icon"></img>
              <h1 className="podcast__name">Podify</h1>
            </div>
            <div className='nav__buttons'>
              <div className = {`home ${page === "Home"?'homeActive' : '' }`}>
               <img src='./public/Home Page.png' alt='home icon' className='icon'></img>
               <h3
               onClick = {goToHome}
             
               >Home</h3>
              
              </div>
              <div className = {`user ${page === "LogIn"?'userActive' : '' }`}>
              <img src='./public/User.png' alt='user icon' className='icon'></img>
             <h3
             
              onClick = {goToLogIn}
             >Log In</h3>
              </div>
              <div className = 'bookmark'>
              <img src='./public/Bookmark.png' alt='bookmark icon' 
              className = {`icon ${page === "Favorites"?'bookmarkActive' : '' }`}
              ></img>
              <h3
             
              onClick = {goToFavorites}>
               Your Library</h3>
              </div>
               
            </div>
            </nav>
        </div>

    )
}