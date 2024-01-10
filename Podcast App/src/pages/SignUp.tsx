import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../Client'


export const SignUp = () => {

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
      navigate("/")
      alert('Check your email for verification link')

      
    } catch (error) {
      alert(error)
    }
  }




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
          Sign In
        </button>
        </div>
        

       </div>
      </form>
      <Link to='/LogIn'>
      <button  className='login__container'>
          Log In?
      </button>
      </Link>
    </div>
  )
}

