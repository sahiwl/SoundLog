import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import { SocialProof } from "../components/Landing/Social";

const Landing = () => (
  <div className=" text-white bg-gry-950">
    <Hero />
    <Features />
    <SocialProof />
  </div>
);

export default Landing;
