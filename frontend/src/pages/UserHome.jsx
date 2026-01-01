import React, { useEffect, useState } from "react";
import HeaderAfterLogin from "./../components/Headers/HeaderAfterLogin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../components/axios";

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [slots, setSlots] = useState({ twoWheeler: 0, fourWheeler: 0 });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [allotedSlot, setAllotedSlot] = useState(null); 
  const [bookedVehicle, setBookedVehicle] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/users/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await api.get("/api/vehicle/getAll");
        setVehicles(response.data.data);
      } catch (error) {
        toast.error("Failed to load vehicles");
      }
    };

    const fetchSlots = async () => {
      try {
        const response = await api.get("/api/slots/freeslots");
        setSlots(response.data.data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchUser();
    fetchVehicles();
    fetchSlots();

    const interval = setInterval(fetchSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBooking = async () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }

    let entryISO;
    if (entryDate && entryTime) {
      entryISO = new Date(`${entryDate}T${entryTime}`).toISOString();
    } else {
      entryISO = new Date().toISOString();
    }

    try {
      const response = await api.post("/api/booking", {
        vehicle: selectedVehicle,
        entrytime: entryISO,
      });

      const booked = response.data.data; // assuming backend returns { data: booking }
      setBookingDetails(booked.booking);
      setAllotedSlot(booked.freeSlot)
      setBookedVehicle(booked.bookedvehicle)
      console.log(booked);
      console.log(response.data.data)

      toast.success("Booking successful!");
      setSelectedVehicle("");
      setEntryDate("");
      setEntryTime("");
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderAfterLogin photoUrl={user?.avatar} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-[90%] max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Slots Section */}
          <div className="flex flex-col justify-center items-center border-r md:border-r-2 border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Available Slots
            </h2>
            <div className="space-y-4 text-lg">
              <p className="bg-green-100 px-6 py-3 rounded-xl shadow-sm">
                2-Wheeler:{" "}
                <span className="font-bold text-green-700">
                  {slots.twoWheeler}
                </span>
              </p>
              <p className="bg-blue-100 px-6 py-3 rounded-xl shadow-sm">
                4-Wheeler:{" "}
                <span className="font-bold text-blue-700">
                  {slots.fourWheeler}
                </span>
              </p>
            </div>
          </div>

          {/* Booking Section */}
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Book Your Slot
            </h2>

            <select
              className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:ring-2 focus:ring-blue-400"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicleno} ({v.vehicletype})
                </option>
              ))}
            </select>

            <div className="flex gap-3 w-full mb-4">
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-3 flex-1 focus:ring-2 focus:ring-blue-400"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
              <input
                type="time"
                className="border border-gray-300 rounded-lg p-3 flex-1 focus:ring-2 focus:ring-blue-400"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-600 text-white rounded-lg px-8 py-3 font-medium shadow-md hover:bg-blue-700 transition w-full"
              onClick={handleBooking}
            >
            Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Show Booking Details after Success */}
      {bookingDetails && (
        <div className="flex justify-center items-center py-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-[90%] max-w-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Booking Confirmed!
            </h3>
            <p className="mb-2">
              <span className="font-medium">Slot Number:</span>{" "}
              {allotedSlot?.slotno || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-medium">Slot Type:</span>{" "}
              {allotedSlot?.slottype || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-medium">Floor:</span>{" "}
              {allotedSlot?.floor || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-medium">Rate: ₹</span>{" "}
              {allotedSlot?.rate || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-medium">Vehicle:</span>{" "}
              {bookedVehicle?.vehicleno} (
              {bookedVehicle?.vehicletype})
            </p>
            <p className="mb-2">
              <span className="font-medium">Entry Time:</span>{" "}
              {new Date(bookingDetails.entrytime).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
