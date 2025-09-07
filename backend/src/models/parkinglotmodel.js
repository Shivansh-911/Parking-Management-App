import mongoose, { Schema } from 'mongoose';


const parkinglotSchema = new Schema(
    {
        zonename: {
            type: String,
            required: true,
            trim: true,
        },
        totalslots: {
            type: Number,
            required: true,
        },
        slot: [{
            type: Schema.Types.ObjectId,
            ref: "ParkingSlot"
        }],
        
    },
    {
        timestamps:true
    }
);

export const Parking = mongoose.model("Parking",parkinglotSchema);