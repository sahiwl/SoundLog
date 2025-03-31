import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-toastify';

const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isCheckingAuth: true, // Set initial value to true
    isAuthenticated: false,
    isUpdatingProfile: false,

    checkAuth: async ()=>{
        set({isCheckingAuth: true});
        try {
            const res = await axiosInstance.get("/auth/check");
            if (res.data) {
                set({
                    authUser: res.data,
                    isAuthenticated: true
                });
            } else {
                set({
                    authUser: null,
                    isAuthenticated: false
                });
            }
        } catch (error) {
            console.error("Error in checkAuth: ", error.message);
            set({
                authUser: null,
                isAuthenticated: false
            });
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async(data)=>{
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data, isAuthenticated: true})
            return { success: true, data: res.data }
        } catch (error) {
            console.error("Error in signup: ", error.message)
            return { 
                success: false, 
                error: error.response?.data?.message || "Signup failed"
            }
        }finally{
            set({isSigningUp: false})
        }
    },

    signin: async(data)=>{
        set({isLoggingUp: true})
        try {
            const res = await axiosInstance.post("/auth/login", {
                username: data.username,  // Change from email to username
                password: data.password
            });
            set({authUser: res.data, isAuthenticated: true})
            return { success: true, data: res.data };
        } catch (error) {
            console.error("Error in signin: ", error.message)
            return { 
                success: false, 
                error: error.response?.data?.message || "signin failed. Please check your credentials." 
            };
        }finally{
            set({isLoggingUp: false})
        }
    },
    
    logout: async () => {
        try {
          await axiosInstance.post('/auth/logout');
          set({ authUser: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout error: ", error.message);
        }
      },

      updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.patch("auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error in updateProfile:", error);
            toast.error(error.response.data.message);
        } finally{
            set({isUpdatingProfile: false});
        }
    }

}))

export default useAuthStore