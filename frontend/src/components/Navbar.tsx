import { useCallback, useState } from "react";
import { Search, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { showToast } from "../lib/toastConfig";
import FullScreenSearch from "./Search";
import UserAvatar from "./UserAvatar";
import type { AuthUser } from "../types/user";

interface UserSectionProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  user: AuthUser | null;
}

const UserSection = ({
  isAuthenticated,
  onLogout,
  user,
}: UserSectionProps) => {
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Link to="/signup" className="button-primary text-center">
        SIGN UP
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/${user.username}/profile`)}
      >
        <UserAvatar
          username={user.username}
          src={user.profilePic}
          size={28}
          textClassName="text-xs"
        />
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
  );
};

const Navbar = () => {
  const { logout, isAuthenticated, authUser } = useAuthStore();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hideSearchIcon = ["/", "/signup", "/signin"].includes(
    location.pathname
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      showToast.success("Logging you out, redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error("Logout failed:", error);
      showToast.error("Logout failed. Please try again.");
    }
  }, [logout, navigate]);

  const navPaths = ["reviews", "albums", "listenlater", "likes"] as const;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1D232A]/95 border-b border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="shrink-0">
                <Link
                  to={isAuthenticated ? "/home" : "/"}
                  className="flex items-center"
                >
                  <span className="text-xl font-bold">
                    Sound<span className="text-purple-400">Log</span>
                  </span>
                </Link>
              </div>

              {authUser && (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-center space-x-4">
                    {navPaths.map((path) => (
                      <Link
                        key={path}
                        to={`/${authUser.username}/${path}`}
                        className="nav-link px-3 py-2 text-sm text-white font-medium"
                      >
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0">
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

            <div className="md:hidden flex items-center gap-2 shrink-0">
              {!hideSearchIcon && (
                <button
                  onClick={() => setShowSearchOverlay(true)}
                  className="p-2 rounded-b-md text-gray-400 hover:text-white"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && authUser && (
          <div className="md:hidden bg-[#1D232A]/95 border-t border-gray-800">
            <div className="px-4 py-3 space-y-2">
              <Link
                to={`/${authUser.username}/profile`}
                className="flex items-center gap-2 hover:text-white cursor-pointer"
              >
                <UserAvatar
                  username={authUser.username}
                  src={authUser.profilePic}
                  size={24}
                  textClassName="text-xs"
                />
                <span className="text-gray-300">
                  {authUser.username.toUpperCase()}
                </span>
              </Link>
              {navPaths.map((path) => (
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
