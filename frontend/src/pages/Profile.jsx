import React, { useEffect, useState } from "react";
import HeaderAfterLogin from "../components/Headers/HeaderAfterLogin";
import { toast, ToastContainer } from "react-toastify";
import api from "../components/axios";
import ChangePassword from './../components/ChangePassword';

const ProfilePage = () => {
    
    const [user, setUser] = useState(null);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        avatar: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/api/users/me");
                setUser(response.data.data);
            } catch (error) {
                toast.error("Failed to load profile");
            }
        };
        fetchUser();
    }, []);

    // Sync form data with user
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || "",
                username: user.username || "",
                email: user.email || "",
                avatar: user.avatar || "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000",
            });
        }
    }, [user]);

    // Handle input change
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Change profile picture
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, avatar: previewUrl }));

            // Upload to API
            const data = new FormData();
            data.append("avatar", file);

            
        }
    };

    // Remove photo
    const handleRemovePhoto = () => {
        setFormData((prev) => ({ ...prev, avatar: "" }));
    };

    // Save changes
    const handleSave = () => {
        setLoading(true);
        api.post("/api/users/updateDetails", {
                fullname: formData.fullname,
                username: formData.username,
                email: formData.email,
            })
            .then(() => {
                toast.success("Profile updated successfully");
            })
            .catch((err) => toast.error(err?.response?.data?.message || "Failed to update profile"))
            .finally(() => setLoading(false));
            console.log(formData.avatar);
    };

    // Reset changes
    const handleReset = () => {
        if (user) {
            setFormData({
                fullName: user.fullname || "",
                username: user.username || "",
                email: user.email || "",
                avatar: user.avatar || "",
            });
        }
        toast.info("Changes reset");
    };

    const logout = async () => {
        try {
            const response = await api.post("/api/users/logout");
            console.log(response.data);
            if(response.data.statusCode === 200) {
                toast.success("Logout Successfull Redirecting!!");
                setTimeout(() => {
                    window.location.href = "/login"; // Redirect to login page
                }, 2000);
            }
        } catch (error) {
            toast.error("Failed to logout");
        }
    } 

    return (
        <div className="flex flex-col bg-gray-50">
            <HeaderAfterLogin photoUrl={user?.avatar} />
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex flex-col items-center flex-1 p-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center gap-3 mb-6">
                        <label className="relative cursor-pointer">
                            <img
                                src={formData.avatar || "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 hover:opacity-80 hover:border-blue-700"
                            />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </label>
                        {formData.avatar && (
                            <button
                                onClick={handleRemovePhoto}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Remove Photo
                            </button>
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border rounded-lg text-white bg-gray-700 hover:bg-gray-900"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => setIsChangePasswordOpen(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            Change Password
                        </button>
                    </div>
                   
                </div>
            </div>
            <ChangePassword
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
            <button 
                className="mx-auto w-50 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 "
                onClick={logout}>
                LOG OUT
            </button>

        </div>
        
    );
};

export default ProfilePage;
