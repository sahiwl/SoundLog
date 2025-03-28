
import React, { useState } from 'react';
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-black/80 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">
            Sound<span className="text-purple-400">Log</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#community" className="nav-link">Community</a>
          <Link to="/login" className="button-secondary">Login</Link>
          <Link to="/signup" className="button-primary text-center">Sign Up</Link>
          </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-black/90 shadow-lg border-b border-white/5 ${
        mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="px-6 py-4 flex flex-col space-y-4">
          <a 
            href="#features" 
            className="nav-link py-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="nav-link py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="#community" 
            className="nav-link py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Community
          </a>
          <div className="flex flex-col space-y-3 pt-2">
            <Link to="/login" className="button-secondary text-center">Login</Link>

            <Link to="/signup" className="button-primary text-center">Sign Up</Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
