import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { showToast } from '../lib/toastConfig.js';

const AuthRoute = ({ routeType }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className="loading loading-infinity loading-xl"></div>
      </div>
    );
  }

  // Auth routes (signin/signup) - User is redirected to home if logged in, 
  // need to logout before going to auth pages
  if (routeType === "auth") {
    if (isAuthenticated) {
      showToast.error('Please logout first to access this page');
      return <Navigate to="/home" />;
    }
    return <Outlet />;
  }

  // Protected routes - Redirect to signin if not logged in
  if (routeType === "protected") {
    if (!isAuthenticated) {
      showToast.error('Please login to access this page');
      return <Navigate to="/signin" />;
    }
    return <Outlet />;
  }

  // Default fallback
  return <Navigate to="/" />;
};

export default AuthRoute;
