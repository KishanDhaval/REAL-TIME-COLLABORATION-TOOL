import { useEffect, useReducer, createContext, useState } from "react";

// Create the authentication context
export const AuthContext = createContext();

// Reducer function to manage authentication state
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_USER":
      return { user: { ...state.user, ...action.payload } }; // Update user details
    default:
      return state; // Return the current state for unknown actions
  }
};

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          dispatch({ type: "LOGIN", payload: JSON.parse(user) });
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  console.log("AuthContext state:", state); 

  // Provide the context to children components
  return (
    <AuthContext.Provider value={{ ...state, dispatch, isLoading }}>
      {!isLoading && children}{" "}
      {/* Render children only after loading is complete */}
    </AuthContext.Provider>
  );
};
