import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { supabase } from '../Client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { resetUsersData, setUsersData } from '../store/userDataSlice';
import { addId } from '../store/IdSlice';
import { userInfo } from 'os';
import { addToShowFavorites, clearShowFavorites } from '../store/favoriteShowSlice';


type FavoriteShowData = Array<FavoriteShow>;

type FavoriteShow = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Array<{
    season: number;
    title: string;
    image: string;
    episodes: Array<{
      title: string;
      description: string;
      episode: number;
      file: string;
    }>;
  }>;
  genres: Array<string>;
  updated: Date;
};

type userInfo = {
  name: string;
  id: string;
  favorites: FavoriteShowData;
};

type LoginProps = {
  setPage: React.Dispatch<React.SetStateAction<string>>
 };


export const LogIn: React.FC<LoginProps> = ({setPage}) => {

  const ids = useSelector((state: RootState) => state.id.id);
  const userData = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch();
  
  
  const [formData,setFormData] = useState({
        email:'',password:''
  })
  
  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }

    })

  }
 
  useEffect(() => {
    const idDataString = localStorage.getItem('ids');
    if (idDataString) {
      const idData = JSON.parse(idDataString);
     dispatch(addId(idData))
    }
  }, [dispatch]);
  
  
 async function fetchUserData(){
    dispatch(resetUsersData())
    
     const { data, error } = await supabase
      .from('users')
      .select('*')

    // Find the user data for each ID
    ids.forEach((id) => {
      const info: userInfo = data.find((info: userInfo) => info.id === id);
      if(info){
        dispatch(clearShowFavorites)
        dispatch(setUsersData(info))
        info.favorites.forEach((show) => dispatch(addToShowFavorites(show)))
        localStorage.setItem('user', JSON.stringify(info))
        console.log(info)
      } else{
        console.log('User info not found')
      }
    })
     
   }

   
 const goToSignUpPage = () => {
  setPage('SignUp')
 }
 
 const goBackToHomePage = () => {
  setPage('Home')
 }

  async function handleSubmit(event) {
   
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
  
      if (error) {
        throw error;
      }

       fetchUserData();
      
      goBackToHomePage()
    } catch (error) {
      alert(error);
    }
    
  }
  


  return (
    <div>
      <div className='login__page'>
      <form onSubmit={handleSubmit}
       className='loginform__container'
      >
        <input 
          placeholder='Email'
          name='email'
          onChange={handleChange}
          className='email__login'  
        />

        <input 
          placeholder='Password'
          name='password'
          type="password"
          onChange={handleChange}
          className='password__login'
        />
        
        <div className='button__containers'>
       
        <button type='submit'  className='signup__login' onClick={goToSignUpPage}>
          Sign Up?
        </button>
    

        <button type='submit'  className='submit__login' >
          Log In
        </button>
        </div>

      </form>
      </div>
    </div>
  )
}