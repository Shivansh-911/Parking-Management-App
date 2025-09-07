import mongoose, { Schema } from 'mongoose';


const parkingslotSchema = new Schema(
    {
        slotno: {
            type: String,
            index: true,
            required: true,
            trim: true,
        },
        slottype: {
            type: String,
            enum: ["2-wheeler","4-wheeler"],
            required: true,
            trim: true,
        },
        isOccupied: {
            type: Boolean,
            required: true,
            default: false
        },
        floor: {
            type: Number,
            required: true,
        },
        bookingstatus: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            default: null,
        },
        rate: {
            type: Number,
            required: true
        }
    },
    {
        timestamps:true
    }
);

export const ParkingSlot = mongoose.model("ParkingSlot",parkingslotSchema);