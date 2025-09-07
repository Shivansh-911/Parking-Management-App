import express from "express";

import { verifyAccessJWT } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import { cancelBooking, createBooking, getAllBookings, getBookingById, getMyBookings, updateBookingExit } from "../controller/bookingcontroller.js";



const router = express.Router();

// Create a new booking
router.post("/",verifyAccessJWT, createBooking);
router.get("/",verifyAccessJWT , getMyBookings)
router.get("/allbookings",verifyAccessJWT , authorizeRoles("admin"), getAllBookings)
router.delete("/cancelbooking/:id",verifyAccessJWT , cancelBooking)
router.put("/exitbooking/:id",verifyAccessJWT, updateBookingExit)
router.get("/:id",verifyAccessJWT , getBookingById)

export default router;
