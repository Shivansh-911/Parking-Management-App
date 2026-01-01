import React, { useEffect, useState } from "react";
import HeaderAfterLogin from "../components/Headers/HeaderAfterLogin";
import api from "../components/axios";
import { toast, ToastContainer } from "react-toastify";
import VehicleUpdate from "../components/VechileUpdate";  // <-- Import here


const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    vehicleno: "",
    vehicletype: "",
    makemodel: "",
    color: "",
  });

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
    const fetchVehicles = async () => {
      try {
        const response = await api.get("/api/vehicle/getAll");
        setVehicles(response.data.data);
      } catch (error) {
        toast.error("Failed to load vehicles");
      }
    };
    fetchVehicles();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    

    if (!form.vehicleno.trim()) {
      toast.error("Vehicle Number is required");
      return;
    }
    if (!form.vehicletype.trim()) {
      toast.error("Vehicle Type is required");
      return;
    }

    try {
      if (editMode) {
        const response = await api.post(`/api/vehicle/update/${currentId}`, form);
        setVehicles(
          vehicles.map((v) =>
            v._id === currentId ? response.data.data : v
          )
        );
        toast.success("Vehicle updated successfully!");
      } else {
        const response = await api.post("/api/vehicle/add", form);
        setVehicles([...vehicles, response.data.data]);
        toast.success("Vehicle added successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }

    // Reset form + modal
    setForm({ vehicleno: "", vehicletype: "", makemodel: "", color: "" });
    setEditMode(false);
    setShowModal(false);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Vehicle?")) return;
    try {
      await api.post(`/api/vehicle/delete/${id}`);
      setVehicles(vehicles.filter((v) => v._id !== id));
      toast.success("Vehicle deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete vehicle");
    }
  };

  const handleUpdate = (vehicle) => {
    setEditMode(true);
    setCurrentId(vehicle._id);
    setForm(vehicle);
    setShowModal(true);
  };

  return (
    <div>
      <HeaderAfterLogin photoUrl={user?.avatar} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center max-w-4xl mx-auto mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-800">My Vehicles</h1>
        <button
          onClick={() => {
            setEditMode(false);
            setForm({ vehicleno: "", vehicletype: "", makemodel: "", color: "" });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Vehicle
        </button>
      </div>

      {/* Vehicle List */}
      <div className="max-w-5xl mx-auto">
        {vehicles.length === 0 ? (
          <p className="text-center text-gray-500">No vehicles found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {vehicle.vehicleno}
                </h3>
                <p className="text-gray-600"><b>Type:</b> {vehicle.vehicletype}</p>
                <p className="text-gray-600"><b>Model:</b> {vehicle.makemodel || "N/A"}</p>
                <p className="text-gray-600"><b>Color:</b> {vehicle.color || "N/A"}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleUpdate(vehicle)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <VehicleUpdate
        showModal={showModal}
        editMode={editMode}
        form={form}
        setForm={setForm}
        handleAdd={handleAddOrUpdate}  // Updated handler
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default VehiclePage;
