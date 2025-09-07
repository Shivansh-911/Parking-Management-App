import { User } from "../models/usermodels.js";
import { Vehicle } from "../models/vehmodel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const addVehicle = asynchandler( async (req, res) => {
    
    const { vehicleno, vehicletype, makemodel, color } = req.body;   
    const userId = req.auth._id;
        
    if(!(vehicleno && vehicletype)) {
        throw new ApiError(404,"Vehicle No or Type not defined");
    }

    const existedVehicle = await Vehicle.findOne({
            $and: [{vehicleno},{owner:userId}]
    });
    if(existedVehicle) {
        throw new ApiError(404,"Vehicle with same No already exists");
    }


    const vehicle = await Vehicle.create({
        vehicleno,
        vehicletype,
        makemodel,
        color,
        owner: userId
    });

   await User.findByIdAndUpdate(
        userId,
        { $push: {vechiledetails: vehicle._id}},
        { new: true}
    );

    res.status(201).json(
        new ApiResponse(
            200,
            vehicle,
            "Vehicle added"
        )
    );
    
});


const getUserVehicles = asynchandler( async (req, res) => {
    
    const vehicles = await Vehicle.find({ owner: req.auth.id }).select("-owner");
    res.status(200).json(
        new ApiResponse(
            200,
            vehicles,
            "List of all the Vehicles for the user"
        )
    );
    
});

const deleteVehicle =asynchandler( async (req, res) => {
    

    const userId = req.auth._id;
    const vehicleId = req.params.id;
    console.log(vehicleId);
    const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, owner: userId });

    if (!vehicle) {
        throw new ApiError(404,"Vehicle Not Found")
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { vechiledetails: vehicleId}},
        { new: true}
    );

    res.status(200).json(
        new ApiResponse(
            200,
            {
                vehicle,user
            },
            "vehicle deleted"
        )
    );
    
});

const updateVehicle =asynchandler( async (req, res) => {

    console.log("In here")
    const userId = req.auth._id;
    const vehicleId = req.params.id;
    
    const updates = req.body;
    const vehicle = await Vehicle.findOneAndUpdate(
        { _id: vehicleId, owner: userId },
        updates,
        { new: true }
    );

    if (!vehicle) {
        throw new ApiError(401,"Vechile Not Found")
    }
    
    res.status(200).json(
        new ApiResponse(
            200,
            vehicle,
            "Vehicle Updated"
        )
    );
    
});


export {
    addVehicle,
    getUserVehicles,
    deleteVehicle,
    updateVehicle,
}