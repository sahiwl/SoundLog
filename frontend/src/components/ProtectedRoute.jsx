import { Navigate, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      toast.warning('Please sign in to access this page', {
        toastId: 'auth-warning', // Prevents duplicate toasts
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }, [isCheckingAuth, isAuthenticated]);

//   if (isCheckingAuth) {
//     return (
//       <div className='flex items-center justify-center min-h-screen'>
//         <div className="loading loading-infinity loading-xl"></div>
//       </div>
//     );
//   }

  if (!isAuthenticated) {
    setTimeout(() => {
      navigate("/signin");
    }, 2500);
    
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className="loading loading-infinity loading-xl"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
