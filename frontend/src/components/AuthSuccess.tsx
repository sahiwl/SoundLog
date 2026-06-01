import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { showToast } from "../lib/toastConfig";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await checkAuth();
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          showToast.success("Successfully signed in with Google!");
          navigate("/home");
        } else {
          showToast.error("Authentication failed. Please try again.");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error during Google authentication:", error);
        showToast.error("Authentication failed. Please try again.");
        navigate("/signin");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [checkAuth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg" />
      <p className="ml-2 text-white">Completing authentication...</p>
    </div>
  );
};

export default AuthSuccess;
