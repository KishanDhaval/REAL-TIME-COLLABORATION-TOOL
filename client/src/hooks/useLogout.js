import { useAuthContext } from "./useAuthContext";
import toast from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate(); 

  const logout = () => {
    localStorage.removeItem('user');
    
    dispatch({ type: 'LOGOUT' });
    
    toast.success("You’ve successfully logged out. We’ll miss you!🙃 Come back soon!");

    navigate("/"); 
  };

  return { logout };
};
