/*import React, { useState } from 'react';
import { supabase } from '../supabase';
import { setUser } from '../store/authSlice';
import { RootState, useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux';

interface User {
  id: string;
  email: string;
  // Add other user properties you expect to receive
}

export const SignUp: React.FC = () => {

  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch(); // Use the useDispatch hook

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Handle sign-up error
        console.error('Sign-up failed:', error);
      } else if (data && data.user) {
        // User successfully signed up
        console.log('User signed up:', data.user);
      
        // Dispatch the setUser action with the user data
        dispatch(setUser(data.user));
      
        // Redirect to the desired page after successful sign-up
        // Use the router of your choice to navigate to the appropriate route.
        // For example, you can redirect to the home page after sign-up:
        // history.push('/home');
      }
  } catch (error) {
    console.error('Sign-up error:', error.message);
  }

  }


  return (
    <div>
      <h2>Sign Up</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};
*/
