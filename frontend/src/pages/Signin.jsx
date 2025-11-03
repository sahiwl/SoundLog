import React, { useState } from 'react'
import useAuthStore from '../store/useAuthStore.js'
import { Eye, EyeOff, X } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Background from '../components/Background.jsx';
import { showToast } from '../lib/toastConfig.js';

const Signin = () => {
  const [formData, setformData] = useState({username: '', password: ''})  
  const [showPassword, setshowPassword] = useState(false)

  const {signin} = useAuthStore();
  
const navigate = useNavigate()
  const validateForm = ()=>{
    return !formData.username || !formData.password 

  }

  const handleChange = (e)=>{
    setformData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(validateForm()){
      showToast.warn("Please enter in all the fields")
      return;
    }
    try {
      const result = await signin(formData);
      if (!result.success) {
          showToast.error(`Signin error: ${result.error}`, {
            autoClose: 5000
          });
      } else {
        showToast.success('🦄 Signin Successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
          // console.log("signin successful:", result.data);

          // Clear form
          setformData({username: '', password: ''});

          // Redirect after showToast completes
          setTimeout(() => {
              navigate('/home');
          }, 2500);
      }
  } catch (error) {
      console.error("signin error2:", error);
      showToast.error("An unexpected error occurred");
  }
    }

    const handleGoogleAuth = () =>{
      window.location.href = `${import.meta.env.VITE_gAuthURL}/auth/google`;
    }

  return (
    <Background imageUrl="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070&auto=format&fit=crop" className="flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-grids rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-white">Sign in</h2>
        <p className="mt-1 text-sm text-gray-400">
            Enter your username below to sign in to your account
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="text-left">
                <label className="block text-sm font-medium text-gray-300">Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
                />
            </div>

            <div className="text-left relative">
                <label className="flex justify-between text-sm font-medium text-gray-300">
                    <span>Password</span>
                    {/* <a href="#" className="text-gray-400 hover:underline">
                        Forgot your password?
                    </a> */}
                </label>
                <input
                    type={showPassword? "text" : "password"}
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
                />
                <button 
                    type='button'
                    className='absolute right-3 top-8 text-gray-500 hover:text-white cursor-pointer'
                    onClick={() => setshowPassword(!showPassword)}
                > {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>} </button>
            </div>

            <button
                type='submit'
                className="w-full rounded bg-white px-4 py-2 text-black font-medium hover:bg-gray-200">
                Sign in
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-white underline">
                Sign up
            </Link>
        </p>
      </div>
      <ToastContainer stacked />
    </Background>
  )
}

export default Signin
