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



export const SignUp = () => {

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

/*useEffect(() => {
  fetchUsers()
}, [])

async function fetchUsers(){
  const {data} = await supabase
    .from('users')
    .select('*')
    setUsers(data)
    console.log(data)
}


async function getUsersById(){
  const { data, error } = await supabase.auth.admin.getUserById()
}*/

 //This function inserts each user information with their favorites into the "users" table.
 /*async function createUser(){
  await supabase
  .from('users')
  .insert([
    {id: id, name: user?.user?.user_metadata?.full_name, favorites: favorites },
  ])
  console.log("it happened")
  //fetchUsers()
 }
*/

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
    console.log(user)
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
      navigate('/components/Homepage')
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
    <div>
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
        <div>
        <button type='submit' className='submit__container'>
          Sign Up

        </button>
       
        </div>
        

       </div>
      </form>
      <Link to='/pages/LogIn'>
      <button  className='login__container'>
          Log In?
      </button>
      </Link>
    </div>
  )
}

