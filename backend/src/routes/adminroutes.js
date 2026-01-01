import { Router } from "express";
import { upload } from "../middleware/multermiddleware.js"
import { verifyAccessJWT, verifyRefreshJWT } from "../middleware/authmiddleware.js"
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchDashboard } from "../controller/admincontroller.js";


const router = Router();


router.get("/dashboard",
  verifyAccessJWT,
  authorizeRoles("admin"), 
  fetchDashboard
);


router.get("/users", verifyAccessJWT, authorizeRoles("admin"), (req, res) => {
  // Later connect to controller -> get all users
  res.json({ message: "List of all users (admin only)" });
});


router.post("/parking-lot", verifyAccessJWT, authorizeRoles("admin"), (req, res) => {
  // Later connect to controller -> create parking lot
  res.json({ message: "New parking lot created" });
});

export default router;
