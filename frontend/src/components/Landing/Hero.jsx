// import clsx from "clsx";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";



const Hero = () => {
  const {checkAuth, authUser, isCheckingAuth} = useAuthStore()
  const iconicAlbumCover = "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"; 

  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  // console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen'>
        <div className="loading loading-infinity loading-xl"></div>
    </div>
  )
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden ">
      <div 
        style={{ backgroundImage: `url(${iconicAlbumCover})` }}
        className="absolute inset-0 w-full mt-26 h-full bg-cover bg-center opacity-90 filter blur-xs scale-110" 
        aria-hidden="true"
      ></div>

      <div className="absolute inset-0 bg-gray-900 opacity-60"></div>

      <div className="relative z-10 flex flex-col items-center px-6 py-24 mt-16"> 
      <div className="pt-10 pb-32"></div>    
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight max-w-3xl">
          Track albums you’ve heard.
          <br />
          Save those you want to hear.
          <br />
          Tell your friends what’s good.
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-lg">
          Your new home for music. Join thousands of other album enthusiasts.
        </p>
        <Link to="/signup"
          className="bg-soundlog-purple text-white text-lg px-8 py-3.5 rounded-full font-bold hover:bg-soundlog-purple transition-all duration-300 shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105"
        >
          Get Started—It’s Free
        </Link>
      </div>
    </section>
  );
};



export default Hero;
