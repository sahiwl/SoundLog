import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { showToast } from '../lib/toastConfig';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // JWT is already set as a cookie by the backend
        // We just need to check auth status to update the frontend state
        await checkAuth();
        showToast.success('Successfully signed in with Google!');
        navigate('/home');
      } catch (error) {
        console.error('Error during Google authentication:', error);
        showToast.error('Authentication failed. Please try again.');
        navigate('/signin');
      }
    };
    
    handleAuthSuccess();
  }, [checkAuth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg"></div>
      <p className="ml-2 text-white">Completing authentication...</p>
    </div>
  );
};

export default AuthSuccess;