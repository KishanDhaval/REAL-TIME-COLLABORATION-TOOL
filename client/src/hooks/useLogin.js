import { useAuthContext } from "./useAuthContext";
import axiosInstance from "../utils/axiosConfig";
import toast from "react-hot-toast";

export const useLogin = () => {
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    try {
      // Use a loading toast for the login request
      const { data } = await toast.promise(
        axiosInstance.post(`/api/auth/login`, { email, password }), // The login request
        {
          loading: 'Logging in...', // Loading message
          success: (response) => response.data.message || 'Login successful!', // Custom success message from API
          error: (err) => err.response?.data?.message || 'Login failed. Please try again.', // Custom error message from API
        }
      );

      if (!data.success) {
        toast.error(data.message || "Login failed. Please try again.");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({ type: "LOGIN", payload: data.user });
      }
    } catch (error) {
      console.log(error.message);      
    }
  };

  return { login };
};
