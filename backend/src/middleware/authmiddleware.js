import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/usermodels.js";

const verifyAccessJWT = asynchandler(async (req,res,next) => {
   try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        
        if(!accessToken) {
            throw new ApiError(401,"Unauthorized Error");
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-refreshToken");

        if(!user) {
            throw new ApiError(401,"User not found for access Token")
        }

        req.auth = user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access token")
    }    

})

const verifyRefreshJWT = asynchandler(async (req,res,next) => {
    
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","");

    if(!refreshToken) {
        throw new ApiError(401,"Unauthorised Token")
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(401,"Invalid or Expired Refersh token")
    } 

    const user = await User.findById(decodedToken?._id)

    if(!user) {
        throw new ApiError(401,"User not found for refersh Token")
    }
    req.auth = {
        user,
        incomingRefreshToken: refreshToken
    };
    next()
})

export { verifyAccessJWT, verifyRefreshJWT }