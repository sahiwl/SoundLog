import { Github, Linkedin } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-back text-white py-1 border-t border-white/5">
      <div className="py-3 px-10 space-y-2">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Sound<span className="text-purple-400">Log</span>
          </h2>
          <div className="flex gap-6 text-gray-500">
            <a href="https://github.com/sahiwl" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/sahilkr04" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Linkedin size={20} />
            </a>
          </div>
        </div>


        <div className="flex justify-between items-center mb-4">
          <p className="text-zinc-400 text-lg max-w-xl">
            Track your music journey, share your thoughts, and discover new albums. 
            Join our community of passionate music lovers today.
          </p>
          <div className="text-zinc-400 text-lg text-right">
            <p>Made with 🩶 by Sahil</p>
            <p>© {new Date().getFullYear()} SoundLog. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
