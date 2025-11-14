import { Github, Linkedin } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-12 bg-gray-900/50 border-t border-gray-900/40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <a href="#" className="text-2xl font-bold text-white tracking-tighter mb-2 inline-block">
                Sound<span className="text-purple-400">Log</span>
              </a>
              <div className="text-zinc-400 text-sm sm:text-base text-left sm:text-right">
                       {/* <p>© {new Date().getFullYear()} SoundLog. All rights reserved.</p>*/}
                     </div>
  
            </div >
            
             <p>Made by sahil</p>
            <div className="flex gap-5">
              <a href="https://linkedin.com/in/sahilkr04" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                         <Linkedin size={20} />
                       </a>
              <a href="https://github.com/sahiwl" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                         <Github size={20} />
                       </a>
            </div>
          </div>
        </footer>
  );
};

export default Footer;
