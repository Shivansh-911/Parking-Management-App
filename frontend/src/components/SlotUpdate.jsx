import React from "react";

const SlotFormModal = ({ 
  showModal, 
  editMode, 
  form, 
  setForm, 
  handleAdd, 
  setShowModal 
  
  }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {editMode ? "Update Slot" : "Add New Slot"}
        </h2>

        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slot Number
            </label>
            <input
              type="text"
              value={form.slotno}
              onChange={(e) => setForm({ ...form, slotno: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slot Type
            </label>
            <select
              value={form.slottype}
              onChange={(e) => setForm({ ...form, slottype: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="">Select Type</option>
              <option value="2-wheeler">2-wheeler</option>
              <option value="4-wheeler">4-wheeler</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor
            </label>
            <input
              type="text"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate
            </label>
            <input
              type="number"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-200 ${
                editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {editMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotFormModal;
