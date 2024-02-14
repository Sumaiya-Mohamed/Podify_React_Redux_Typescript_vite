import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { supabase } from '../Client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setToken } from '../store/tokenSlice';
import { resetUsersData, setUsersData } from '../store/userDataSlice';
import { addId } from '../store/IdSlice';
import { userInfo } from 'os';


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

type user = {
  name: string;
  id: string;
  favorites: FavoriteShowData;
};

export const LogIn = () => {
  let navigate = useNavigate()
  const ids = useSelector((state: RootState) => state.id.id);
  const users =  useSelector((state: RootState) => state.users);
  const userData = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch();
  
  const [userIds, setUserIds] = useState([])
  const [formData,setFormData] = useState({
        email:'',password:''
  })
  
  /*useEffect(() => {
   setUserIds(ids)
    console.log(ids)
  }, [ids])
 */
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
      
     /* userIds.forEach((id) => {
        const userInfo = data.find((info) => info.id === id )
        if(userInfo){
          dispatch(setUsersData(userInfo))
          console.log(userInfo)
        } else {
          console.log('user not found')
        }
      })*/

    // Find the user data for each ID
    console.log(ids)
    ids.forEach((id) => {
      const userInfo = data.find((info: user) => info.id === id);
      if(userInfo){
        dispatch(setUsersData(userInfo))
        console.log(userInfo)
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
       navigate('/components/Homepage');
        console.log(userData)
        console.log(data)
      
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


  return (
    <div>
      <form onSubmit={handleSubmit}>
        

        <input 
          placeholder='Email'
          name='email'
          onChange={handleChange}
        />

        <input 
          placeholder='Password'
          name='password'
          type="password"
          onChange={handleChange}
        />

        <button type='submit'>
          Submit
        </button>


      </form>
      Don't have an account? <Link to='/pages/SignUp'>Sign Up</Link> 
    </div>
  )
}