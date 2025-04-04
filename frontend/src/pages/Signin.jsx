import React, { useState } from 'react'
import useAuthStore from '../store/useAuthStore.js'
import { Eye, EyeOff, X } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Background from '../components/Background.jsx';
import { showToast } from '../lib/toastConfig.js';

const Signin = () => {
  const [formData, setformData] = useState({username: '', password: ''})  // Change email to username
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

        {/* <button className="mt-4 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
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
