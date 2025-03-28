import React, { useState, useEffect, useCallback, memo } from "react";
import { Menu, X, Search, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { toast, ToastContainer, Zoom } from "react-toastify";

// const SearchInput = memo(({ className }) => (
//   <div className="relative">
//     <input
//       type="text"
//       placeholder="Search..."
//       className={className || "px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"}
//     />
//     <Search className="absolute right-2 top-2 text-gray-400" size={18} />
//   </div>
// ));

const UserSection = memo(({ isAuthenticated, onLogout }) =>
  isAuthenticated ? (
    <div className="flex items-center space-x-4">
      <User className="text-white" size={24} />
      <button
        onClick={onLogout}
        className="text-white hover:text-purple-400 transition-colors"
      >
        <LogOut size={20} />
      </button>
    </div>
  ) : (
    <Link to="/signup" className="button-primary text-center">
      Join Now
    </Link>
  )
);

const Navbar = memo(() => {
  const { checkAuth, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logging you out, redirecting...");
    setTimeout(() => {
      navigate("/");
    }, 2500);
  }, [logout]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-black/80 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
        <a href="/" className="flex-shrink-0">
          <span className="text-xl font-bold text-white">
            Sound<span className="text-purple-400">Log</span>
          </span>
        </a>

        <div className="flex items-center space-x-6 overflow-x-auto">
          {/* <SearchInput className="w-48 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none" /> */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
            />
            <Search
              className="absolute right-2 top-2 text-gray-400"
              size={18}
            />
          </div>

          <Link to="/songs" className="nav-link whitespace-nowrap">
            Songs
          </Link>
          <Link to="/albums" className="nav-link whitespace-nowrap">
            Albums
          </Link>
          <Link to="/listen-later" className="nav-link whitespace-nowrap">
            ListenLater
          </Link>
          <Link to="/likes" className="nav-link whitespace-nowrap">
            Likes
          </Link>
          <UserSection
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        </div>
      </div>
      <ToastContainer transition={Zoom} />
    </nav>
  );
});

export default Navbar;
