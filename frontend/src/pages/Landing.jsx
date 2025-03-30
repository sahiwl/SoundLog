import React, { useEffect } from 'react'
import clsx from 'clsx'
import Navbar from '../components/Navbar'
import Features from '../components/Landing/Features'
import HowItWorks from '../components/Landing/HowItWorks'
import Footer from '../components/Landing/Footer'
import useAuthStore from '../store/useAuthStore'
import { Link } from 'react-router-dom'


const Landing = () => {

  return (    
    <div className=' text-white bg-gray-950'>
      <Hero />
      <Features/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}


const Hero = () => {
  const {checkAuth, authUser, isCheckingAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen'>
        <div className="loading loading-infinity loading-xl"></div>
    </div>
  )
  return (
    <div className="min-h-max bg-gray-900 relative">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-b from-gray-800 to-gray-900">
        <div
          className={clsx(
            "absolute inset-0 bg-cover bg-center opacity-80",
            "[mask-image:linear-gradient(to_right,transparent,black_50%,black_50%,transparent)]",
            "[mask-image:linear-gradient(to_bottom,transparent,black_50%,black_50%,transparent)]"
          )}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {" "}
            Share Your <span className="text-purple-400">Music Journey</span>
          </h1>

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mb-8">
            Discover, rate, and review music that moves you. Connect with a
            community of passionate listeners and create your personal music
            library.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            
            <Link to={authUser ? "/home" : "/signup"} className="button-primary text-center">
              Start Logging
            </Link>

            {/* <Link to={authUser ? "/home" : "/signup"} className="button-primary text-center">
              Start Logging
            </Link> */}
            <a href="#features" className="button-secondary text-center">
              Explore Features
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;