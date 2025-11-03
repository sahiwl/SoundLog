import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore.js';
import { Eye, EyeOff, X } from "lucide-react";
import { showToast } from '../lib/toastConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import Background from '../components/Background.jsx';
import { ToastContainer } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setformData]= useState({username: '', email: '', password: ''})
  const [showPassword, setshowPassword] = useState(false)

  const {signup} = useAuthStore();

  const validateForm = () =>{
    return !formData.username || !formData.email || !formData.password 
  }

  const handleChange  = (e)=>{
    // e.preventDefault()
    setformData({...formData, [e.target.name] : e.target.value})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(validateForm()){
      showToast.warn("Please fill in all the fields!")
      return;
    }
    try {
      const result = await signup(formData);
      if (!result.success) {
          showToast.error(`Signup error: ${result.error}`);
      } else {
          showToast.success('Signup Successful!');
          setformData({username: '', email: '', password: ''});
          setTimeout(() => {
              navigate('/');
          }, 2500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      showToast.error("An unexpected error occurred");
    }
  }
   const handleGoogleAuth = () =>{
      window.location.href = `${import.meta.env.VITE_gAuthURL}/auth/google`;
    }
  return (
    // <div className="flex min-h-screen items-center justify-center bg-black px-4">
    <Background imageUrl={"https://images.unsplash.com/photo-1741620979760-bccef3bb5b17?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} className={"flex items-center justify-center"}>
    <div className="max-w-md mx-auto p-8 bg-grids rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-white">Sign-up</h2>
      <p className="mt-1 text-sm text-gray-400">
      Enter the fields below to create an account
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-300">Username</label>
        <input
        type="text"
        name="username"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
        />
      </div>

      <div className="text-left">
        <label className="block text-sm font-medium text-gray-300">Email</label>
        <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="temp@example.com"
        className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
        />
      </div>

      <div className="text-left relative">
        <label className="flex justify-between text-sm font-medium text-gray-300">
        <span>Password</span>
        </label>
        <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder='Password'
        value={formData.password}
        onChange={handleChange}
        className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
        />
        <button 
        type='button'
        className='absolute right-3 top-8 text-gray-500 hover:text-white cursor-pointer'
        onClick={() => setshowPassword(!showPassword)}
        > 
        {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>} 
        </button>
      </div>

      <button 
        type="submit"
        className="w-full rounded bg-white px-4 py-2 text-black font-medium hover:bg-gray-200">
        Signup
      </button>
      </form>

<div className="relative my-4 flex items-center">
  <div className="flex-grow border-t border-gray-700"></div>
  <span className="mx-4 flex-shrink text-gray-500">or</span>
  <div className="flex-grow border-t border-gray-700"></div>
</div>

{/* <button 
  type="button"
   onClick={handleGoogleAuth}
  className="mt-4 w-full flex items-center justify-center gap-3 rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
>
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
  Sign in with Google
</button> */}
      <p className="mt-4 text-center text-sm text-gray-400">
      been here already?{' '}
      <Link to="/signin" className="text-white underline">
        Login
      </Link>

      </p>
    {/* </div> */}
    <ToastContainer stacked />
    </div>
    </Background>
  )
  }

export default Signup
