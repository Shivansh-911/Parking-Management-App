import express from "express";

import { verifyAccessJWT } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import { createSlot , getAllSlots , updateSlot , deleteSlot, getFreeSlots } from "../controller/parkingSlotController.js";

const router = express.Router();

// Only Admin can manage slots
router.post("/", verifyAccessJWT, authorizeRoles("admin"), createSlot);
router.get("/", verifyAccessJWT, authorizeRoles("admin"), getAllSlots);
router.put("/:id", verifyAccessJWT, authorizeRoles("admin"), updateSlot);
router.delete("/:id", verifyAccessJWT, authorizeRoles("admin"), deleteSlot);
router.get("/freeslots",verifyAccessJWT,  getFreeSlots);

export default router;
