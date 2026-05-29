import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { showToast } from "../lib/toastConfig";

let authCheckPromise = null;

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingUp: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    if (authCheckPromise) return authCheckPromise;

    set({ isCheckingAuth: true });
    authCheckPromise = (async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        if (res.data) {
          set({ authUser: res.data, isAuthenticated: true });
        } else {
          set({ authUser: null, isAuthenticated: false });
        }
      } catch (error) {
        console.error("Error in checkAuth: ", error.message);
        set({ authUser: null, isAuthenticated: false });
      } finally {
        set({ isCheckingAuth: false });
        authCheckPromise = null;
      }
    })();

    return authCheckPromise;
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data, isAuthenticated: true });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error in signup: ", error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isLoggingUp: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        username: data.username,
        password: data.password,
      });
      set({ authUser: res.data, isAuthenticated: true });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error in signin: ", error.message);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "signin failed. Please check your credentials.",
      };
    } finally {
      set({ isLoggingUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error: ", error.message);
    } finally {
      set({ authUser: null, isAuthenticated: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/update-profile", data);
      set({ authUser: res.data });
      showToast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      showToast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

export default useAuthStore;
