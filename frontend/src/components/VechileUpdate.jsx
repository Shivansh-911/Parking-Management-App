import React from "react";

const VehicleFormModal = ({
  showModal,
  editMode,
  form,
  setForm,
  handleAdd,
  setShowModal,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editMode ? "Update Vehicle" : "Add New Vehicle"}
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <input
            type="text"
            name="vehicleno"
            placeholder="Vehicle Number"
            value={form.vehicleno}
            onChange={(e) => setForm({ ...form, vehicleno: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Vehicle Type Selector */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Vehicle Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, vehicletype: "2-wheeler" })}
                className={`flex-1 px-4 py-2 rounded-lg border 
                  ${form.vehicletype === "2-wheeler"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"}`}
              >
                Two Wheeler
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, vehicletype: "4-wheeler" })}
                className={`flex-1 px-4 py-2 rounded-lg border 
                  ${form.vehicletype === "4-wheeler"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"}`}
              >
                Four Wheeler
              </button>
            </div>
          </div>

          <input
            type="text"
            name="makemodel"
            placeholder="Make/Model"
            value={form.makemodel}
            onChange={(e) => setForm({ ...form, makemodel: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {editMode ? "Update Vehicle" : "Save Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormModal;
