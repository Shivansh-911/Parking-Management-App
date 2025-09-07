import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema(
    {
        vehicleno: {
            type: String,
            trim: true,
            index: true,
            required: true,
            unique: true,
        },
        vehicletype: {
            type: String,
            enum: ["2-wheeler","4-wheeler"],
            trim: true,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        makemodel: {
            type: String,
            trim: true
        },
        color: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const Vehicle = mongoose.model('Vehicle',vehicleSchema);