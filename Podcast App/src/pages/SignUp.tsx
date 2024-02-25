import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { supabase } from '../Client'
import { IdSlice, addId } from '../store/IdSlice';
import { setUsers, userSlice } from '../store/userSlice';
import { resetUsersData, setUsersData } from '../store/userDataSlice';
import {userDataSlice} from '../store/userDataSlice'
import { RootState } from '../store/store';
import { v4 as uuidv4 } from 'uuid';
import { userInfo } from 'os';
import { clearShowFavorites } from '../store/favoriteShowSlice';
import { clear } from 'console';

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

  type SignUpProps = {
   setUserInfo : React.Dispatch<React.SetStateAction<{
    name: string;
    id: string;
    favorites: any[];
}>>
   userInfo: userInfo;
   setPage: React.Dispatch<React.SetStateAction<string>>
  };

export const SignUp: React.FC<SignUpProps>= ({setUserInfo, userInfo, setPage}) => {

  const allIds = useSelector((state: RootState) => state.id.id)
  const token = useSelector((state: RootState) => state.token)
  const user = useSelector((state: RootState) => state.userData)
  const favorites = useSelector((state: RootState) => state.favoriteShow)
 
  const dispatch = useDispatch();
 
  
  const [formData,setFormData] = useState({
    fullName:'',
    email:'',
    password:''
  })

  const navigate = useNavigate()

  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }

    })

  }


async function handleUserRegistration(){
  dispatch(resetUsersData())

  const userId = uuidv4();

  localStorage.setItem('ids', JSON.stringify(userId))
  
  try{
    const {data, error} = await supabase
    .from('users')
    .upsert([
      {id: userId, name: formData.fullName, favorites: favorites },
    ])
    
    dispatch(setUsersData({id: userId, name: formData.fullName, favorites: favorites }))
    dispatch(clearShowFavorites)
    localStorage.setItem('user', JSON.stringify({id: userId, name: formData.fullName, favorites: favorites }))
    if(error){
      console.log('Error creating user:', error)
    }else{
      console.log('User created successfully', data)
    }
  }catch(error){
    console.log('Error creating user:', error)
  }

}

  async function handleSubmit(event){
    event.preventDefault()
    
    try {
      const { data, error } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            }
          }
        }
      )
      if (error) throw error
     // dispatch(setId(data.user.id))
      dispatch(setUsers(data))
      
      handleUserRegistration();
      setPage('Home')
      alert('Check your email for verification link')
    } catch (error) {
      alert(error)
    }
    
    
  }

  /*useEffect(() => {
   if(id){
    handleUserRegistration()

   }
  }, [id])
   */   
  

  return (
    <div className='signup__page'>
      <form onSubmit={handleSubmit}>
        <div className='signup__container'>
        <input 
          placeholder='Fullname'
          name='fullName'
          onChange={handleChange}
          className='fullname__container'
        />

        <input 
          placeholder='Email'
          name='email'
          onChange={handleChange}
          className='email__container'  
        />

        <input 
          placeholder='Password'
          name='password'
          type="password"
          onChange={handleChange}
          className='password__container'
        />
        <div className='button__container'>
        
        <button type='submit' className='submit__signup'>
          Sign Up
        </button>
       </div>
        

       </div>
      </form>
      
    </div>
  )
}

