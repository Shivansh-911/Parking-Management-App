import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "./axios";

const ChangePassword = ({ isOpen, onClose }) => {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const data = {
      oldpassword: oldPassword,
      newpassword: newPassword,
      confpassword: confirmPassword
    }
    try {
        
        setLoading(true);
        const res = await api.post("/api/users/changePassword",data);

        toast.success(res.data.message || "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose(); 
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-white bg-gray-700 hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
