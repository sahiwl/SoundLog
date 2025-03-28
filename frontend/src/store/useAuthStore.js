import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';

const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isCheckingAuth: false,

    isUpdatingProfile: false,

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
        } catch (error) {
            console.error("Error in checkAuth: ", error.message)
            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async(data)=>{
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data})
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

    login: async(data)=>{
        set({isLoggingUp: true})
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({authUser: res.data})
            console.log("Login successful:", res.data);
            return { 
                success: true, 
                data: res.data,
                message: "Login successful!" 
            };
        } catch (error) {
            console.error("Error in login: ", error.message)
            return { 
                success: false, 
                error: error.response?.data?.message || "Login failed. Please check your credentials." 
            };
        }finally{
            set({isLoggingUp: false})
        }
    },
    
    logout: async () => {
        try {
          await axios.post('/auth/logout');
          set({ authUser: null });
        } catch (error) {
          console.error("Logout error: ", error.message);
        }
      }
}))

export default useAuthStore