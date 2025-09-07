import axios from "axios";
import { toast } from "react-toastify";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", 
  withCredentials: true, 
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;
    console.log(originalRequest);
    
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    //console.log("Inside Interceptor");
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/api/users/login" &&
      originalRequest.url !== "/api/users/refreshToken"
    ) {
      originalRequest._retry = true;
      console.log("Inside Try Block");
      try {
        const res = await axios.post("http://localhost:8000/api/users/refreshToken", 
          {},
          {
          withCredentials: true,
        });

        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("AccessToken Refreshed");

        return api(originalRequest);

        
      } catch (refreshError) {
        
        localStorage.removeItem("accessToken");
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/login";  
        }, 2000);
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
