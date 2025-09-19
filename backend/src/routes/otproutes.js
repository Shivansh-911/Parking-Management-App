import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Otp } from "../models/otpmodel.js";
import { asynchandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/sendotp",asynchandler(async (req, res) => {
    
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  
  await Otp.deleteMany({ email });

    
  await Otp.create({ email, otp: hashedOtp });

  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  return res.status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully"));
  })
);


router.post("/verifyotp",asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const record = await Otp.findOne({ email });
  if (!record) {
    throw new ApiError(400, "OTP expired or not found");
  }

  const isMatch = await bcrypt.compare(otp, record.otp);
  if (!isMatch) {
    throw new ApiError(400, "Invalid OTP");
  }

  
  await Otp.deleteMany({ email });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
  })
);

export default router;
