import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { supabase } from '../Client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setToken } from '../store/tokenSlice';
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
  setUserInfo : React.Dispatch<React.SetStateAction<{
   name: string;
   id: string;
   favorites: any[];
}>>
  userInfo: userInfo;
  setPage: React.Dispatch<React.SetStateAction<string>>
 };


export const LogIn: React.FC<LoginProps> = ({setPage,setUserInfo, userInfo,}) => {
  let navigate = useNavigate()
  const ids = useSelector((state: RootState) => state.id.id);
  const users =  useSelector((state: RootState) => state.users);
  const userData = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch();
  
  const [userIds, setUserIds] = useState([])
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
    console.log(ids)
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


       // dispatch(setId(data.user.id));  
       fetchUserData();
      
       setPage('Home')
        console.log(userData)
      goBackToHomePage()
    } catch (error) {
      alert(error);
    }
    
  }
  
  
 /*if(token){
  sessionStorage.setItem('token', JSON.stringify(token))
 }
 console.log(token)

 useEffect(() => {
 if(sessionStorage.getItem('token')){
  let newData = JSON.parse(sessionStorage.getItem('token'))
  dispatch(setToken(newData))
 }
 }, [])*/

 const goToSignUpPage = () => {
  setPage('SignUp')
 }
 
 const goBackToHomePage = () => {
  setPage('Home')
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