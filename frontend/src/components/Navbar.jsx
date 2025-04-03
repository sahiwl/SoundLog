import React, { useState, useEffect, useCallback } from "react";
import { Search, User, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
    <Link to="/signup" className="button-primary text-center">
      SIGN UP
    </Link>
  );
};

const Navbar = () => {
  const { checkAuth, logout, isAuthenticated, authUser } = useAuthStore();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const hideSearchIcon = ["/", "/signup", "/signin"].includes(location.pathname);

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-grids border-b border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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

            {/* Right Side Menu - Search Icon and User Section */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              {!hideSearchIcon && (
                <button
                  onClick={() => setShowSearchOverlay(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}

              <UserSection
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                user={authUser}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2 flex-shrink-0">
              {!hideSearchIcon && (
                <button
                  onClick={() => setShowSearchOverlay(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-white"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white"
              >
                  {isMobileMenuOpen ? (
                    <X />
                  ) : (
                    <Menu/>
                  )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && authUser && (
          <div className="md:hidden bg-base-100/95 border-t border-gray-800">
            <div className="px-4 py-3 space-y-2">
              <Link 
                to={`/${authUser.username}/profile`}
                className="flex items-center gap-2 hover:text-white cursor-pointer"
              >
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
              </Link>
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
        <FullScreenSearch onClose={() => setShowSearchOverlay(false)} />
      )}
    </>
  );
};

export default Navbar;