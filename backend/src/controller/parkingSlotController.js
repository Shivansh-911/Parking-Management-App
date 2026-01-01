
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ParkingSlot } from "../models/parkingslotmodel.js";


const createSlot = asynchandler(async (req, res) => {
  console.log(req.body);
  const { slotno, slottype, floor, rate } = req.body;
  
  const existing = await ParkingSlot.findOne({ slotno });
  if (existing) {
    throw new ApiError(400, "Slot already exists");
  }

  const newSlot = await ParkingSlot.create({
    slotno,
    slottype,
    floor,
    rate
  });

  res
    .status(201)
    .json(new ApiResponse(201, newSlot, "Slot created successfully"));
});


const getAllSlots = asynchandler(async (req, res) => {
  const slots = await ParkingSlot.find();
  res.status(200).json(new ApiResponse(200, slots, "List of all parking slots"));
});

const updateSlot = asynchandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const slot = await ParkingSlot.findByIdAndUpdate(id, updates, { new: true });

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, slot, "Slot updated successfully"));
});


const deleteSlot = asynchandler(async (req, res) => {
  const { id } = req.params;
  const slot = await ParkingSlot.findByIdAndDelete(id);

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "Slot deleted successfully"));
});

const getFreeSlots = asynchandler(async (req, res) => {
  const twoWheelerFree = await ParkingSlot.countDocuments({
    slottype: "2-wheeler",
    isOccupied: false,
  });

  const fourWheelerFree = await ParkingSlot.countDocuments({
    slottype: "4-wheeler",
    isOccupied: false,
  });

  if (!twoWheelerFree && !fourWheelerFree) {
    throw new ApiError(404, "No free slots available");
  }

  return res.status(200).json(
    new ApiResponse(200, 
    { 
      twoWheeler: twoWheelerFree, 
      fourWheeler: fourWheelerFree 
    },
     "Free slots fetched successfully"  
    ));
});




export {
  createSlot,
  getAllSlots,
  updateSlot,
  deleteSlot,
  getFreeSlots
}