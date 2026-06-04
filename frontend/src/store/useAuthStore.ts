import { create } from "zustand";
import { isAxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { showToast } from "../lib/toastConfig";
import type {
  AuthUser,
  ChangePasswordInput,
  LoginInput,
  SignupInput,
  UpdateUserProfileInput,
} from "../types/user";

type AuthActionResult =
  | { success: true; data: AuthUser }
  | { success: false; error: string };

interface AuthState {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  isUpdatingProfile: boolean;
  isChangingPassword: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignupInput) => Promise<AuthActionResult>;
  signin: (data: LoginInput) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateUserProfileInput) => Promise<void>;
  changePassword: (data: ChangePasswordInput) => Promise<boolean>;
}

let authCheckPromise: Promise<void> | null = null;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  isUpdatingProfile: false,
  isChangingPassword: false,

  checkAuth: async () => {
    if (authCheckPromise) return authCheckPromise;

    set({ isCheckingAuth: true });
    authCheckPromise = (async () => {
      try {
        const res = await axiosInstance.get<AuthUser>("/auth/check");
        if (res.data) {
          set({ authUser: res.data, isAuthenticated: true });
        } else {
          set({ authUser: null, isAuthenticated: false });
        }
      } catch (error) {
        console.error("Error in checkAuth:", getErrorMessage(error, "Auth check failed"));
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
      const res = await axiosInstance.post<AuthUser>("/auth/signup", data);
      set({ authUser: res.data, isAuthenticated: true });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error in signup:", getErrorMessage(error, "Signup failed"));
      return {
        success: false,
        error: getErrorMessage(error, "Signup failed"),
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/auth/login", {
        username: data.username,
        password: data.password,
      });
      set({ authUser: res.data, isAuthenticated: true });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error in signin:", getErrorMessage(error, "Signin failed"));
      return {
        success: false,
        error: getErrorMessage(
          error,
          "Signin failed. Please check your credentials."
        ),
      };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", getErrorMessage(error, "Logout failed"));
    } finally {
      set({ authUser: null, isAuthenticated: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch<AuthUser>(
        "/auth/update-profile",
        data
      );
      set({ authUser: res.data });
      showToast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      showToast.error(getErrorMessage(error, "Update failed"));
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  changePassword: async (data) => {
    set({ isChangingPassword: true });
    try {
      await axiosInstance.patch("/auth/change-password", data);
      showToast.success("Password updated successfully");
      return true;
    } catch (error) {
      console.error("Error in changePassword:", error);
      showToast.error(getErrorMessage(error, "Failed to update password"));
      return false;
    } finally {
      set({ isChangingPassword: false });
    }
  },
}));

export default useAuthStore;
