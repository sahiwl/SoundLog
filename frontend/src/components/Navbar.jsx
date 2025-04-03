import React, { useState, useEffect, useCallback } from "react";
import { Search, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { showToast } from "../lib/toastConfig.js";
import FullScreenSearch from "./Search.jsx";

const UserSection = ({ isAuthenticated, onLogout, user }) => {
  const navigate = useNavigate();

  return isAuthenticated ? (
    <div className="flex items-center space-x-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/${user.username}/profile`)}
      >
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center text-sm font-medium text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-gray-300 hover:text-white">
          {user.username.toUpperCase()}
        </span>
      </div>
      <button
        onClick={onLogout}
        className="text-gray-300 hover:text-white transition-colors"
      >
        <LogOut size={20} />
      </button>
    </div>
  ) : (
    <Link to="/signin" className="button-primary text-center">
      SIGN IN
    </Link>
  );
};

const Navbar = () => {
  const { checkAuth, logout, isAuthenticated, authUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    showToast.success("Logging you out, redirecting...");
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-base-100/95  border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 ">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Desktop Menu */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to={isAuthenticated ? "/home" : "/"}className="flex items-center">
                  <span className="text-xl font-bold">
                    Sound<span className="text-purple-400">Log</span>
                  </span>
                </Link>
              </div>

              {/* Desktop Menu Links - hidden on mobile */}
              {authUser && (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-center space-x-4">
                    {['reviews', 'albums', 'listenlater', 'likes'].map((path) => (
                      <Link
                        key={path}
                        to={`/${authUser.username}/${path}`}
                        className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                      >
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Menu - Search and User Section */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered w-full bg-gray-800/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                <Search className="absolute right-2 top-2 text-gray-400" size={18} />
              </div>

              <UserSection
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                user={authUser}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="relative w-40">
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                <Search className="absolute right-2 top-2 text-gray-400" size={18} />
              </div>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && authUser && (
          <div className="md:hidden bg-base-100/95 border-t border-gray-800">
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                {authUser.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-sm font-medium text-white">
                    {authUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-300">{authUser.username.toUpperCase()}</span>
              </div>
              {['reviews', 'albums', 'listenlater', 'likes'].map((path) => (
                <Link
                  key={path}
                  to={`/${authUser.username}/${path}`}
                  className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  {path.charAt(0).toUpperCase() + path.slice(1)}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {showSearchOverlay && (
        <FullScreenSearch query={searchQuery} onClose={handleCloseSearch} />
      )}
    </>
  );
};

export default Navbar;