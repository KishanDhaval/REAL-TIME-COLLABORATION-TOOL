import { useAuthContext } from "./useAuthContext";
import axiosInstance from "../utils/axiosConfig";
import toast from "react-hot-toast";

export const useRegister = () => {
  const { dispatch } = useAuthContext();

  const register = async (name, userName, email, password) => {
    try {
      const { data } = await toast.promise(
        axiosInstance.post(`/api/auth/register`, {
          name,
          userName,
          email,
          password,
        }),
        {
          loading: 'Registering...', 
          success: (response) => response.data.message || 'Registration successful!', 
          error: (err) => err.response?.data?.message || 'Registration failed. Please try again.', 
        }
      );

      if (!data.success) {
        toast.error(data.message || "Register failed. Please try again.");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({ type: "LOGIN", payload: data.user });
      }
    } catch (error) {
      console.log(error.message); 
    }
  };

  return { register };
};
