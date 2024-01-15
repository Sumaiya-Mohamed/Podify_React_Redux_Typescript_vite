import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { supabase } from '../Client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setToken } from '../store/tokenSlice';


export const LogIn = () => {
  let navigate = useNavigate()
  const token = useSelector((state: RootState) => state.token);
  const dispatch = useDispatch();

  const [formData,setFormData] = useState({
        email:'',password:''
  })

  console.log(formData)

  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }

    })

  }

  async function handleSubmit(e){
    e.preventDefault()

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })

      if (error) throw error
      dispatch(setToken(data))
      console.log(data)
      navigate('/')

      
    } catch (error) {
      alert(error)
    }
  }

 if(token){
  sessionStorage.setItem('token', JSON.stringify(token))
 }

 useEffect(() => {
 if(sessionStorage.getItem('token')){
  let newData = JSON.parse(sessionStorage.getItem('token'))
  dispatch(setToken(newData))
 }
 }, [])


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
      Don't have an account? <Link to='/SignUp'>Sign Up</Link> 
    </div>
  )
}

