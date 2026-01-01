import { useEffect, useState } from "react";
import api from "../components/axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";  // ✅ Import navigation
import HeaderAdmin from "./../components/Headers/HeaderAdmin";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ Initialize navigation

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setAdmin(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/booking/allbookings");
        setBookings(res.data.data || []);
        console.log("Fetched bookings:", res.data.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    fetchBookings();
  }, []);

  // 🔹 Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = [b.slot.slotno, b.vehicle.vehicleno, b.user?.username]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPayment =
      paymentFilter === "all" || b.paymentstatus === paymentFilter;

    const matchesBooking =
      bookingFilter === "all" || b.status === bookingFilter;

    return matchesSearch && matchesPayment && matchesBooking;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin photoUrl={admin?.avatar} />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto p-6">
      
        <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
          Admin Dashboard
        </h1>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by slot, vehicle, or user..."
            className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-full sm:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Unpaid</option>
          </select>

          <select
            className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm"
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="Active">Active</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-600 animate-pulse">Loading bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-blue-500 text-white text-left">
                <tr>
                  <th className="px-4 py-3">Slot #</th>
                  <th className="px-4 py-3">Vehicle #</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Booking Status</th>
                  <th className="px-4 py-3">Payment Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b, idx) => (
                    <tr
                      key={b._id}
                      className={`border-b hover:bg-gray-50 transition ${
                        idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{b.slot.slotno}</td>
                      <td className="px-4 py-3">{b.vehicle.vehicleno}</td>
                      <td className="px-4 py-3">{b.user?.username}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            b.status === "active"
                              ? "bg-green-100 text-green-600"
                              : b.status === "completed"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            b.paymentstatus === "paid"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {b.paymentstatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex justify-center">
                        <button
                          onClick={() => navigate(`/admin/bookingdetails/${b._id}`)} // ✅ Navigate
                          className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
