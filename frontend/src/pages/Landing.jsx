import React, { useEffect } from 'react'
import Features from '../components/Landing/Features.jsx'
import HowItWorks from '../components/Landing/HowItWorks.jsx'
import Hero from '../components/Landing/Hero.jsx'

const Landing = () => {

  return (    
    <div className=' text-white bg-gry-950'>
      <Hero />
      <Features/>
      <HowItWorks/>

    </div>
  )
}


export default Landing;