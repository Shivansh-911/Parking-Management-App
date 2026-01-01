import { Router } from "express";
import { verifyAccessJWT } from "../middleware/authmiddleware.js";
import { addVehicle, deleteVehicle, getUserVehicles, updateVehicle } from "../controller/vehiclecontroller.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";

const router = Router();

router.route("/add").post(
    verifyAccessJWT,
    authorizeRoles("user"),
    addVehicle,
)

router.route("/getAll").get(
    verifyAccessJWT,
    authorizeRoles("user"),
    getUserVehicles,
)

router.route("/delete/:id").post(
    verifyAccessJWT,
    authorizeRoles("user"),
    deleteVehicle
)

router.route("/update/:id").post(
    verifyAccessJWT,
    authorizeRoles("user"),
    updateVehicle
)

export default router