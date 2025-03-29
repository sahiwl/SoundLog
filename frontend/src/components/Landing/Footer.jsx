
import React from 'react';
import { Instagram, Twitter, Facebook, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-back text-white py-16 border-t border-white/5">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              Sound<span className="text-purple-400">Log</span>
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md">
              Track your music journey, share your thoughts, and discover new albums 
              with our community of passionate music lovers.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-purple-500/30"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-purple-500/30"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-purple-500/30"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-purple-500/30"
                aria-label="Github"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">About Us</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">Careers</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">Blog</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">Terms of Service</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">Cookie Policy</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-purple-400">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} SoundLog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
