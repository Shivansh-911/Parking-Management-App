import { Booking } from "../models/bookingmodel.js";
import { ParkingSlot } from "../models/parkingslotmodel.js";
import { Vehicle } from "../models/vehmodel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const createBooking = asynchandler(async (req, res) => {
  const { vehicle, entrytime } = req.body;
  const userId = req.auth._id;

  if (!vehicle) {
    throw new ApiError(400, "Vehicle ID is required");
  }

  const vehicleDoc = await Vehicle.findById(vehicle);
  if (!vehicleDoc) {
    throw new ApiError(404, "Vehicle not found");
  }
  

  const activeBooking = await Booking.findOne({
    vehicle,
    status: "Active",
  });

  if (activeBooking) {
    throw new ApiError(
      400,
      "This vehicle already has an active booking. Exit first before booking another slot."
    );
  }


  
  const freeSlot = await ParkingSlot.findOne({
    isOccupied: false,
    slottype: vehicleDoc.vehicletype, 
  }).sort({ floor: 1, slotno: 1 }); 

  if (!freeSlot) {
    throw new ApiError(
      400,
      `No free slot available for ${vehicleDoc.vehicletype} vehicles`
    );
  }

  const booking = await Booking.create({
    user: userId,
    vehicle,
    slot: freeSlot._id,
    entrytime: entrytime || new Date(),
    rate: freeSlot.rate,
    charges: 0,
    status: "Active",
  });

  freeSlot.isOccupied = true;
  freeSlot.bookingstatus = booking._id;
  await freeSlot.save();

  return res
    .status(201)
    .json(new ApiResponse(201,{ booking , freeSlot , bookedvehicle:vehicleDoc}, "Booking created & slot auto-assigned"));
});

const getAllBookings = asynchandler(async (req, res) => {
  console.log("insided all bookings");
  const bookings = await Booking.find()
    .populate("user", "username fullname email role")
    .populate("vehicle", "vehicleno vehicletype")
    .populate("slot", "slotno slottype floor");

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "All bookings fetched successfully"));
});



const getMyBookings = asynchandler(async (req, res) => {
  const userId = req.auth._id;

  const bookings = await Booking.find({ user: userId })
    .populate("vehicle", "vehicleno vehicletype")
    .populate("slot", "slotno slottype floor");

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "Your bookings fetched successfully"));
});


const getBookingById = asynchandler(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id)
    .populate("user", "username fullname email role")
    .populate("vehicle", "vehicleno vehicletype")
    .populate("slot", "slotno slottype floor");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (
    req.auth.role !== "admin" &&
    booking.user._id.toString() !== req.auth._id.toString()
  ) {
    throw new ApiError(403, "Forbidden: You cannot access this booking");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});



const updateBookingExit = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { exittime } = req.body;

  const booking = await Booking.findById(id).populate("slot");
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.status !== "Active") {
    throw new ApiError(400, "Booking is not active");
  }

  if (
    req.auth.role !== "admin" &&
    booking.user.toString() !== req.auth._id.toString()
  ) {
    throw new ApiError(403, "Forbidden: You cannot modify this booking");
  }

  booking.exittime = exittime || new Date();
  booking.status = "Completed";

  await booking.save();

  const slot = await ParkingSlot.findById(booking.slot._id);
  slot.isOccupied = false;
  slot.bookingstatus = null;
  await slot.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking updated successfully"));
});



const cancelBooking = asynchandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).populate("slot");
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.status !== "Active") {
    throw new ApiError(400, "Only active bookings can be cancelled");
  }

  if (
    req.auth.role !== "admin" &&
    booking.user.toString() !== req.auth._id.toString()
  ) {
    throw new ApiError(403, "Forbidden: You cannot cancel this booking");
  }

  booking.status = "Cancelled";
  await booking.save();

  const slot = await ParkingSlot.findById(booking.slot._id);
  slot.isOccupied = false;
  slot.bookingstatus = null;
  await slot.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});


export {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingExit, 
  cancelBooking 
}