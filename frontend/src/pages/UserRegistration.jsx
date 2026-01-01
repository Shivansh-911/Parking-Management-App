import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Headers/Header";
import { ToastContainer, toast } from "react-toastify";
import { Eye , EyeOff , CircleUserRound } from 'lucide-react';
import "react-toastify/dist/ReactToastify.css";


const UserRegistration = () => {
  
  
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false); 

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            const file = files[0];
            setFormData({ ...formData, avatar: file });
            if (file) {
                setAvatarPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const removeImage = (e) => {
        console.log("Removing image"); 
        setAvatarPreview(null);
        setFormData({ ...formData, avatar: null });
    };

    const handleRegister = (e) => {
        
        e.preventDefault();
        
        const { fullname, username, email, password, confirmPassword } = formData;
        
        if (!fullname || !username || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (fullname.trim()=="" || username.trim()=="" || email.trim()=="" || password.trim()=="" || confirmPassword.trim()=="") {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setShowOtpModal(true);

    // You can submit data to the backend here
        //console.log("Registration Data:", formData);


        

        
        
        fetch('/api/otp/sendotp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ email: formData.email }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast.success("OTP sent to your email. Please verify.");
            } else {
                toast.error(data.message || "An error occurred while sending OTP.");
                console.error("OTP Error:", data.message );    
            }  
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || error.message || "An error occurred while sending OTP.");
            console.error("OTP Error:", error);
        });


        /*

        setLoading(true);
        const loadingToast = toast.loading("Registering... Please wait.");


        fetch('/api/users/register', {
            method: 'POST',
            body: data,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setTimeout(() => {
                    window.location.href = "/login"; // Redirect to login page
                }, 2000);
                toast.dismiss(loadingToast);
                setLoading(false);
                toast.success("Registration successful! Redirecting to login...");
            } else {
                toast.dismiss(loadingToast);
                setLoading(false);
                toast.error(data.message || "An error occurred during registration.");
                console.error("Registration error:", data.message );    
            }
        })
            */
    };


    const verifyotp = () => {
        if(otp.trim() === "") {
            toast.error("Please enter the OTP.");
            return;
        }

        fetch('/api/otp/verifyotp', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email, otp: otp }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                setShowOtpModal(false);
                setLoading(true);
                const loadingToast = toast.loading("Registering... Please wait.");
                
                const { fullname, username, email, password, confirmPassword } = formData;
                const data = new FormData();
                data.append("fullname", fullname);
                data.append("username", username);
                data.append("email", email);
                data.append("password", password);
                if (formData.avatar) {
                    data.append("avatar", formData.avatar);
                }
                    
                fetch('/api/users/register', {
                    method: 'POST',
                    body: data,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setTimeout(() => {
                            window.location.href = "/login"; // Redirect to login page
                        }, 2000);
                        toast.dismiss(loadingToast);
                        setLoading(false);
                        toast.success("Registration successful! Redirecting to login...");
                    } else {
                        toast.dismiss(loadingToast);
                        setLoading(false);
                        toast.error(data.message || "An error occurred during registration.");
                        console.error("Registration error:", data.message );    
                    }
                })
                .catch(error => {
                    setLoading(false);
                    toast.dismiss(loadingToast);
                    toast.error(error?.response?.data?.message || error.message || "An error occurred during registration.");
                    console.error("Registration error:", error);
                });
            } else {
                toast.error(data.message || "An error occurred while verifying OTP."); 
                console.error("OTP Verification Error:", data.message );
            }
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || error.message || "An error occurred while verifying OTP.");
            console.error("OTP Verification Error:", error);
        });
    }
    


                
                

    return (
        <div>
            <Header />
            <ToastContainer position="top-right" autoClose={3000} />
            <section className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
                <div className="container max-w-2xl bg-white rounded-lg shadow-lg p-8">
                    
                    <div className="flex justify-around items-center">

                        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Create Account</h2>

                        {/* Avatar Upload */}
                        <div className="flex justify-center mb-8">
                        <label htmlFor="avatar" className="cursor-pointer relative">
                            <img
                                src={
                                avatarPreview ||
                                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"

                            }
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover border-2"
                            />

                            <button
                                onClick={removeImage}
                            >
                            <CircleUserRound size={32} className="absolute bottom-6 right-0 bg-white rounded-full p-1 cursor-pointer hover:opacity-90" />
                            </button>
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                accept="image/*"
                                className="hidden"
                                onChange={handleChange}
                            />
                            </label>
                        </div>


                    </div>
                    
                    

                    

                     


                    <form  onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Full Name */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-1" htmlFor="fullname">Full Name</label>
                          <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            required
                          />
                        </div>

                        {/* Username */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-1" htmlFor="username">Username</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            required
                          />
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            required
                          />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
                            <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
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


                        {/* Confirm Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-75 text-sm text-gray-600 hover:text-gray-900 transition duration-200"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition duration-200"
                    disabled={loading}
                    //onSubmit={handleRegister}   if do this then form property will not work
                >
                {loading ? "Registering..." : "Register"}
                </button>

                {/* Login Redirect */}
                <p className="mt-4 text-sm text-center text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login here
                  </Link>
                </p>
                </form>
                {showOtpModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={() => setShowOtpModal(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={verifyotp}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-200"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
                )}
            </div>
        </section>
    </div>
  );
};

export default UserRegistration;
