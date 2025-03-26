import React from 'react'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'


const Landing = () => {
  return (
    
    <div className=' text-white'>
      <Navbar/>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}

export default Landing