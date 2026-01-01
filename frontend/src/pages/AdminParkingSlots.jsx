import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import HeaderAdmin from "./../components/Headers/HeaderAdmin";
import api from "../components/axios";
import SlotFormModal from "../components/SlotUpdate";

const AdminParkingSlots = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [slots, setSlots] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    slotno: "",
    slottype: "",
    floor: "",
    rate: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setAdmin(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);


  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get("/api/slots");
        setSlots(response.data.data);
      } catch (error) {
        toast.error("Failed to load slots");
      }
    };
    fetchSlots();
  }, []);


  const filteredSlots = slots.filter((slot) => {
    const matchesType =
      filterType === "All" || slot.slottype.toLowerCase() === filterType.toLowerCase();

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Occupied" && slot.isOccupied) ||
      (filterStatus === "Free" && !slot.isOccupied);

    const matchesSearch = slot.slotno.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });


  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!form.slotno.trim()) {
      toast.error("Slot Number is required");
      return;
    }
    if (!form.slottype.trim()) {
      toast.error("Slot Type is required");
      return;
    }

    try {
      if (editMode) {
        const response = await api.put(`/api/slots/${currentId}`, form);
        setSlots(
          slots.map((s) => (s._id === currentId ? response.data.data : s))
        );
        toast.success("Slot updated successfully!");
      } else {
        const response = await api.post("/api/slots", form);
        setSlots([...slots, response.data.data]);
        toast.success("Slot added successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }

    setForm({ slotno: "", slottype: "", floor: "", rate: "" });
    setEditMode(false);
    setShowModal(false);
    setCurrentId(null);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      await api.delete(`/api/slots/${id}`);
      setSlots(slots.filter((s) => s._id !== id));
      toast.success("Slot deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin photoUrl={admin?.avatar} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto mt-6 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Parking Slot Management
        </h1>

        {/* Controls */}
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search by slot number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="All">All Types</option>
              <option value="2-wheeler">2-wheeler</option>
              <option value="4-wheeler">4-wheeler</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="All">All Status</option>
              <option value="Free">Free</option>
              <option value="Occupied">Occupied</option>
            </select>
          </div>

          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200"
            onClick={() => {
              setEditMode(false);
              setForm({ slotno: "", slottype: "", floor: "", rate: "" });
              setShowModal(true);
            }}
          >
            + Add Slot
          </button>
        </div>

        {/* List */}
        <div className="bg-white shadow-md rounded-xl divide-y">
          {filteredSlots.map((slot) => (
            <div
              key={slot._id}
              className="flex justify-between items-center p-4 hover:bg-gray-50 transition duration-200"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Slot: {slot.slotno}
                </p>
                <p className="text-sm text-gray-500">Type: {slot.slottype}</p>
                <p className="text-sm text-gray-500">Floor: {slot.floor}</p>
                <p className="text-sm text-gray-500">Rate: {slot.rate}</p>
                <p
                  className={`text-sm font-medium ${
                    slot.isOccupied ? "text-red-600" : "text-green-600"
                  }`}
                >
                  Status: {slot.isOccupied ? "Occupied" : "Free"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200"
                  onClick={() => {
                    setEditMode(true);
                    setCurrentId(slot._id);
                    setForm({
                      slotno: slot.slotno,
                      slottype: slot.slottype,
                      floor: slot.floor,
                      rate: slot.rate,
                    });
                    setShowModal(true);
                  }}
                >
                  Update
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200"
                  onClick={() => handleDelete(slot._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredSlots.length === 0 && (
            <p className="p-6 text-center text-gray-500">No slots found.</p>
          )}
        </div>
      </div>

      <SlotFormModal
        showModal={showModal}
        editMode={editMode}
        form={form}
        setForm={setForm}
        handleAdd={handleAddOrUpdate}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default AdminParkingSlots;
