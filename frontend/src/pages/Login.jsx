import React, { useState } from 'react'
import useAuthStore from '../store/useAuthStore'
import { Eye, EyeOff, X } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setformData]= useState({email: '', password: ''})
  const [showPassword, setshowPassword] = useState(false)

  const {login} = useAuthStore();
  
const navigate = useNavigate()
  const validateForm = ()=>{
    return !formData.email || !formData.password 

  }

  const handleChange = (e)=>{
    setformData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(validateForm()){
      toast.warn("Please enter in all the fields")
      return;
    }
    try {
      const result = await login(formData);
      if (!result.success) {
          toast.error(`Login error: ${result.error}`);
      } else {
        toast.success('🦄 Login Successful!', {
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
          setformData({email: '', password: ''});

          // Redirect after toast completes
          setTimeout(() => {
              navigate('/home');
          }, 2500);
      }
  } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
  }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
    <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-md">
      <h2 className="text-2xl font-semibold text-white">Login</h2>
      <p className="mt-1 text-sm text-gray-400">
        Enter your email below to login to your account
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
          />
        </div>

        <div className="text-left relative">
          <label className="flex justify-between text-sm font-medium text-gray-300">
            <span>Password</span>
            <a href="#" className="text-gray-400 hover:underline">
              Forgot your password?
            </a>
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
          Login
        </button>
      </form>

      <button className="mt-4 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
        Login with Google
      </button>

      <p className="mt-4 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <a href="/signup" className="text-white underline">
          Sign up
        </a>
      </p>
    </div>
    <ToastContainer stacked position='top-right'/>
  </div>

  )
}

export default Login