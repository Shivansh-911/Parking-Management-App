import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../components/axios";
import { toast, ToastContainer } from "react-toastify";
import HeaderAdmin from "./../components/Headers/HeaderAdmin";

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setAdmin(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/api/booking/${id}`);
        setBooking(res.data.data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        toast.error("Failed to fetch booking details");
      }
    };

    fetchDashboard();
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setLoadingCancel(true);
      await api.delete(`/api/booking/cancelbooking/${booking._id}`);
      toast.success("Booking cancelled successfully!");
      setBooking({ ...booking, status: "Cancelled" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking");
    } finally {
      setLoadingCancel(false);
    }
  };

  if (!booking) {
    return <p className="p-6 text-gray-500 animate-pulse">Loading booking details...</p>;
  }

  // Badge styles
  const statusBadge = (status) => {
    if (status === "active") return "bg-green-100 text-green-600";
    if (status === "completed") return "bg-blue-100 text-blue-600";
    if (status === "cancelled") return "bg-gray-200 text-gray-600";
    return "bg-gray-100 text-gray-600";
  };

  const paymentBadge = (payment) => {
    if (payment === "paid") return "bg-blue-100 text-blue-600";
    if (payment.toLowerCase() === "pending" || payment.toLowerCase() === "unpaid") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin photoUrl={admin?.avatar} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Booking Details
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Slot Info */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Slot Info</h2>
            <p><span className="font-medium">Slot #:</span> {booking.slot.slotno}</p>
            <p><span className="font-medium">Floor:</span> {booking.slot.floor}</p>
            <p><span className="font-medium">Type:</span> {booking.slot.slottype}</p>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Vehicle Info</h2>
            <p><span className="font-medium">Vehicle #:</span> {booking.vehicle.vehicleno}</p>
            <p><span className="font-medium">Type:</span> {booking.vehicle.vehicletype}</p>
          </div>

          {/* User Info */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">User Info</h2>
            <p><span className="font-medium">Username:</span> {booking.user.username}</p>
            <p><span className="font-medium">Full Name:</span> {booking.user.fullname}</p>
            <p><span className="font-medium">Email:</span> {booking.user.email}</p>
            <p><span className="font-medium">Role:</span> {booking.user.role}</p>
          </div>

          {/* Booking Info */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition space-y-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Booking Info</h2>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(booking.status)}`}>
                {booking.status}
              </span>
            </p>
            <p>
              <span className="font-medium">Payment Status:</span>{" "}
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentBadge(booking.paymentstatus)}`}>
                {booking.paymentstatus}
              </span>
            </p>
            <p><span className="font-medium">Rate:</span> ₹{booking.rate}</p>
            <p><span className="font-medium">Charges:</span> ₹{booking.charges}</p>
            <p><span className="font-medium">Entry Time:</span> {new Date(booking.entrytime).toLocaleString()}</p>
            <p><span className="font-medium">Created At:</span> {new Date(booking.createdAt).toLocaleString()}</p>
            <p><span className="font-medium">Updated At:</span> {new Date(booking.updatedAt).toLocaleString()}</p>

            {/* Cancel Button */}
            {booking.status === "Active" && (
              <button
                onClick={handleCancel}
                disabled={loadingCancel}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {loadingCancel ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
