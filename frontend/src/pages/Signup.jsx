
import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeOff, X } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
      toast.warn("Please fill in all the fields!")
      return;
    }
    await signup(formData)
    try {
      const result = await signup(formData);
      if (!result.success) {
          toast.error(`Signup error: ${result.error}`);
      } else {
            toast.success('🦄 Signup Successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
          console.log("Login successful:", result.data);

          // Clear form
          setformData({username: '', email: '', password: ''});

          // Redirect after toast completes
          setTimeout(() => {
              navigate('/');
          }, 2500);
      }
  } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred");
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
    <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-md">
      <h2 className="text-2xl font-semibold text-white">Sign-up</h2>
      <p className="mt-1 text-sm text-gray-400">
      Enter your email below to create an account
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

      <button className="mt-4 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
      Signup with Google
      </button>

      <p className="mt-4 text-center text-sm text-gray-400">
      been here already?{' '}
      <a href="/login" className="text-white underline">
        Login
      </a>
      </p>
    </div>
    <ToastContainer stacked />
    </div>
  )
  }

export default Signup
