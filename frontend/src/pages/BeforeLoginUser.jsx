import React, { useState } from "react";
import Header from "../components/Headers/Header";
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../components/axios.jsx";



const BeforeLoginUser = () => {

  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    if(input.trim() === "") {
        toast.error("Empty Username");
        return;
    }
        
    if(password.trim() === "") {
        toast.error("Empty Password"); 
        return;
    }    
    //to check if username is an email
    const isEmail = (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input));
    //to change the value of the button
    setLoading(true);
    const loadingToast = toast.loading("Logging in...");

    const data = {
        username: isEmail ? "" : input,
        email: isEmail ? input : "",
        password: password
    };

    

    
    // Sending Api request in form of a promise
    api.post("/api/users/login", data)
      .then(response => {
        
        const resData = response.data;
        console.log(resData);

        if (resData.success) {
          //setProfilePhoto(resData.data.user.avatar)
          localStorage.setItem("accessToken", resData.data.accessToken);
          toast.dismiss(loadingToast);
          toast.success("Login successful! Redirecting...");

          setTimeout(() => {
            if(resData.data.user.role === "admin")
              navigate("/admin");
            else
              navigate("/user");
          }, 2000);
         
          //console.log("Login successful:", resData.data);
        
        } else {
          return Promise.reject(new Error(resData.message || "Login failed"));
        }
    })
    .catch(error => {
      setLoading(false);
      setPassword("");
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data?.message || error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    });
  };

  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
        <div className="container max-w-6xl px-4">
          <div className="md:flex gap-20 md:flex-row items-center justify-center">
            
            {/* Left Image */}
            <div className="hidden w-full md:flex md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                alt="Login Illustration"
                className="w-full h-auto"
              />
            </div>

            {/* Right Login Form */}
            <div className="w-full md:w-1/2 md:bg-white md:bg-none p-8 rounded-lg shadow-lg ">
              
                <div
                className="absolute inset-0 md:hidden bg-[url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg')] bg-contain bg-no-repeat bg-center opacity-10 z-0 w-full h-full"
                ></div>

                <div className="relative z-10">

                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Login</h3>

                    <form>
                      <div>
                        
                        {/* Username */}
                        <div className="mb-4">
                          <label htmlFor="username or email" className="block text-gray-700 font-medium mb-1">
                            Username or Email:
                          </label>
                        <input
                            type="text"
                            name="user"
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            required
                        />
                        </div>



                      </div>
                        
                      

                        {/* Password */}
                        <div className="mb-4"> 
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
                            <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-75 text-sm text-gray-600 hover:text-gray-900 transition duration-200"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                          </div>
                        </div>


                        {/* Submit Button */}
                        <button
                          type="button"
                          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition duration-200"
                          onClick={handleLogin}
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </button>


                        <p className="mt-4 text-sm text-center text-gray-600">
                            New to the site?{" "}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Create an account
                            </Link>

                        </p>


                        

                        {/* Error Message (optional placeholder) */}
                        <div id="errorMessage" className="mt-3 text-red-600 text-sm"></div>
                    </form>
                </div>
            </div>  
          </div>
        </div>
      </section>
    </div>
  );
};

export default BeforeLoginUser;
