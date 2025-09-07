import { Router } from "express";
import { changeCurrentPassword, getMe, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateDetails } from "../controller/usercontroller.js";
import { upload } from "../middleware/multermiddleware.js"
import { verifyAccessJWT, verifyRefreshJWT } from "../middleware/authmiddleware.js"
import { authorizeRoles } from "../middleware/rolemiddleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), 
    registerUser
)

router.route("/login").post(
    loginUser
)

router.route("/logout").post(
    verifyAccessJWT,
    logoutUser
)

router.route("/refreshToken").post(
    verifyRefreshJWT,
    authorizeRoles("user"),
    refreshAccessToken
)

router.route("/changePassword").post(
    verifyAccessJWT,
    authorizeRoles("user"),
    changeCurrentPassword
)

router.route("/updateDetails").post(
    verifyAccessJWT,
    authorizeRoles("user"),
    updateDetails
)

router.route("/updateAvatar").post(
    verifyAccessJWT,
    authorizeRoles("user"),
    upload.fields([{
            name: "avatar",
            maxCount: 1
        }]),
    updateAvatar
)

router.route("/me").get(
    verifyAccessJWT,
    getMe
)




export default router