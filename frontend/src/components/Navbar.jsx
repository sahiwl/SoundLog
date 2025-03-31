import React, { useState, useEffect, useCallback, memo } from "react";
import { Menu, X, Search, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { toast, ToastContainer, Zoom } from "react-toastify";
import FullScreenSearch from "./Search";


const UserSection = memo(({ isAuthenticated, onLogout, username }) =>
  isAuthenticated ? (
    <div className="flex items-center space-x-4">
      <div className="flex items-center gap-2">
        <User className="text-white" size={24} />
        <span className="text-white">{username}</span>
      </div>
      <button
        onClick={onLogout}
        className="text-white hover:text-purple-400 transition-colors"
      >
        <LogOut size={20} />
      </button>
    </div>
  ) : (
    <Link to="/signin" className="button-primary text-center">
      SIGN IN
    </Link>
  )
);

const Navbar = memo(() => {
  const { checkAuth, logout, isAuthenticated, authUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuthStatus();
  }, []); 

  const handleLogout = useCallback(async () => {
    await logout();
    toast.success("Logging you out, redirecting...");
    setTimeout(() => {
      navigate("/");
    }, 2500);
  }, [logout]);

  const handleSearchFocus = () => {
    setShowSearchOverlay(true);
  };

  const handleCloseSearch = () => {
    setShowSearchOverlay(false);
    setSearchQuery("");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-black/80 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
          <a href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-white">
              Sound<span className="text-purple-400">Log</span>
            </span>
          </a>
          <div className="flex items-center space-x-6 overflow-x-auto">
            {/* Full-screen search input */}
                  <div className="relative w-80">
                    <input
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    />
                    <Search
                    className="absolute right-2 top-2 text-gray-400"
                    size={18}
                    />
                  </div>
                  <Link to={`/${authUser?.username}/reviews`} className="nav-link whitespace-nowrap">
                    Reviews
                  </Link>
                  <Link to={`/${authUser?.username}/albums`} className="nav-link whitespace-nowrap">
                    Albums
                  </Link>
                  <Link to={`/${authUser?.username}/listenlater`} className="nav-link whitespace-nowrap">
                    ListenLater
                  </Link>
                  <Link to={`/${authUser?.username}/likes`}className="nav-link whitespace-nowrap">
                    Likes
                  </Link>
                  <UserSection
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout}
                    username={authUser?.username}
                  />
                  </div>
                </div>
                <ToastContainer transition={Zoom} />
                </nav>
                
                {/* Full-screen search overlay */}
      {showSearchOverlay && (
        <FullScreenSearch
          query={searchQuery}
          onClose={handleCloseSearch}
        />
      )}
    </>
  );
});

export default Navbar;
