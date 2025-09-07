import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const fetchDashboard = asynchandler(async (req,res) => {
    
    console.log("Inside Admin");
    //console.log(req);
    const admin = req.auth;
    return res.status(201).json(
        new ApiResponse(200,admin,"Admin is herre")
    );
})

export {fetchDashboard}