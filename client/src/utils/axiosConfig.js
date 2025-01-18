import axios from "axios";

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Ensure this is set correctly
});

// Add a request interceptor to set the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming you're storing the token in localStorage

    if (user?.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
