import React, { useEffect, useState } from "react";
import HeaderAfterLogin from "./../components/Headers/HeaderAfterLogin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../components/axios";

const UserBookings = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/users/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await api.get("/api/booking");
        setBookings(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load bookings");
      }
    };

    fetchUser();
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/api/booking/${bookingId}`);
      toast.success("Booking cancelled successfully!");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "Cancelled" } : b
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  // Categorize bookings
  const activeBookings = bookings.filter((b) => b.status === "Active");
  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled");

  const getPaymentStatus = (status) => {
    switch (status) {
      case "paid":
        return <span className="text-green-600 font-medium">Paid</span>;
      case "unpaid":
        return <span className="text-red-600 font-medium">Unpaid</span>;
      default:
        return <span className="text-yellow-600 font-medium">Pending</span>;
    }
  };

  const renderTable = (data, allowCancel = false) => (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Slot Number</th>
            <th className="px-4 py-3 text-left">Vehicle Number</th>
            <th className="px-4 py-3 text-left">Vehicle Type</th>
            <th className="px-4 py-3 text-left">Entry Time</th>
            <th className="px-4 py-3 text-left">Exit Time</th>
            <th className="px-4 py-3 text-left">Payment</th>
            {allowCancel && <th className="px-4 py-3 text-left">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((b, index) => (
            <tr key={b._id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{b.slot?.slotno || "—"}</td>
              <td className="px-4 py-3">{b.vehicle?.vehicleno || "—"}</td>
              <td className="px-4 py-3">
                {b.vehicle?.vehicletype === "2-wheeler"
                  ? "Two-Wheeler"
                  : "Four-Wheeler"}
              </td>
              <td className="px-4 py-3">
                {b.entrytime ? new Date(b.entrytime).toLocaleString() : "—"}
              </td>
              <td className="px-4 py-3">
                {b.exittime ? new Date(b.exittime).toLocaleString() : "—"}
              </td>
              <td className="px-4 py-3">{getPaymentStatus(b.paymentStatus)}</td>
              {allowCancel && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  let content;
  if (activeTab === "active") {
    content =
      activeBookings.length > 0 ? (
        renderTable(activeBookings, true)
      ) : (
        <p className="text-gray-500 text-center">No active bookings.</p>
      );
  } else if (activeTab === "completed") {
    content =
      completedBookings.length > 0 ? (
        renderTable(completedBookings)
      ) : (
        <p className="text-gray-500 text-center">No completed bookings.</p>
      );
  } else {
    content =
      cancelledBookings.length > 0 ? (
        renderTable(cancelledBookings)
      ) : (
        <p className="text-gray-500 text-center">No cancelled bookings.</p>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderAfterLogin photoUrl={user?.avatar} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-1 justify-center items-start py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-[95%] max-w-6xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
            My Bookings
          </h2>

          {/* Tabs */}
          <div className="flex justify-center mb-6 space-x-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === "active"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === "cancelled"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Content */}
          {content}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
