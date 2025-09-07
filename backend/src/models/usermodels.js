import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose,{ Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index:true
        },
        role: {
            type: String,
            enum: ["user","admin"],
            required: true,
            default: "user",
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String 
        },
        avatarPublicId: {
            type: String,
            default: ""
        },
        password: {
            type: String,
            required: [true,'Password is required']
        },
        vechiledetails: [{
            type: Schema.Types.ObjectId,
            ref: "Vehicle"
        }],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

//userSchema.pre("save", async function (next) {
//    if(!this.isModified("password")) return next();
//    this.password = await bcrypt.hash(this.password, 10)
//    next()
//})

userSchema.methods.isPasswordCorrect = async function 
(password){
    //return await bcrypt.compare(password,this.password)
    return password === this.password;
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            //expiresIn: "10s"
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            //expiresIn: "1m"
        }
    )
}

export const User = mongoose.model('User',userSchema);