import React from 'react'
import Hero from '../components/Landing/Hero.jsx'
import Features from '../components/Landing/Features.jsx'
import { SocialProof } from '../components/Landing/Social.jsx'
const Landing = () => {

  return (    
    <div className=' text-white bg-gry-950'>
      <Hero />
      <Features/>
      <SocialProof/>
    </div>
  )
}


export default Landing;