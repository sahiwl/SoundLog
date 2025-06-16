import { Github, Linkedin } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-soundlog-dark-gray/20  text-white border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-4">
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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-sm sm:text-base text-center sm:text-left max-w-xl">
            Track your music journey, share your thoughts, and discover new albums. 
            Join our community of passionate music lovers today.
          </p>
          <div className="text-zinc-400 text-sm sm:text-base text-center sm:text-right">
            <p>Made with 🩶 by Sahil</p>
            <p>© {new Date().getFullYear()} SoundLog. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
