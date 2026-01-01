import mongoose, { Schema } from 'mongoose';


const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        slot: {
            type: Schema.Types.ObjectId,
            ref: "ParkingSlot",
            required: true,
        },
        entrytime: {
            type: Date,
            required: true,
        },
        exittime: {
            type: Date,
        },
        duration: {
            type: Number,
        },
        rate: {
            type: Number,
        },
        charges: {
            type: Number,
            required: true,
            default: 0
        },
        paymentstatus: {
            type: String,
            enum: ["Pending","Paid","Failed"],
            default: "Pending",
        },
        status: {
            type: String,
            enum: ["Active","Completed","Cancelled"],
            default: "Active"
        }
        
    },
    {
        timestamps:true
    }
);

bookingSchema.pre("save", function(next) {
    if (this.exittime && this.entrytime) {
        const durMs = this.exittime - this.entrytime;
        const durMins = Math.ceil(durMs / (1000 * 60));
        this.duration = durMins;
        if(this.rate) {
            this.charges = this.rate * durMins;
        } else {
            this.charges = 0;
        }
    } else {
        this.duration = undefined;
        this.charges = 0;
    }
    

    next();
})



export const Booking = mongoose.model("Booking",bookingSchema);