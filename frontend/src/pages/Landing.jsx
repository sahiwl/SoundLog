import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'
import useAuthStore from '../store/useAuthStore'


const Landing = () => {

  // const {checkAuth, authUser, isCheckingAuth} = useAuthStore()

  // useEffect(()=>{
  //   checkAuth()
  // }, [])

  // console.log({authUser});

  // if(isCheckingAuth && !authUser) return(
  //   <div className='flex items-center justify-center h-screen'>
  //       <div className="loading loading-infinity loading-xl"></div>
  //   </div>
  // )

  return (
    
    <div className=' text-white bg-background'>
      <Navbar/>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}

export default Landing