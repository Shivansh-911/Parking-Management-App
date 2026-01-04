import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/usermodels.js"
import { deleteFromCloudinary, uploadOnCloudianary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        const accessToken = await user.generateAccessToken();
        
        const refreshToken = await user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken , refreshToken};

    } catch (error) {
        throw new ApiError(500,`Not able to generate refresh and access token = ${error}`);
    }
}


const registerUser = asynchandler(async (req,res) => {
    
    const {username, password, email, fullname } = req.body
   
    
    if(fullname.trim() === "" || username.trim() === "" || password.trim() === "" || email.trim() === "") {
        throw new ApiError(400, "All fields are required");
    } 
    if(!email.includes("@")) {
        throw new ApiError(401, "Invalid Email");
    }

    const existedUser = await User.findOne({
        $or: [{username} , {email}] 
    })

    if(existedUser)
        throw new ApiError(409, "User Already exists with this email or username")

    /* file upload to cloudinary from local path */
    /*
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    const avatar = await uploadOnCloudianary(avatarLocalPath);
    */

    /* file upload to cloudinary from memory buffer */
    const avatarBuffer = req.files?.avatar?.[0]?.buffer;
    const avatar = await uploadOnCloudianary(avatarBuffer);

    console.log("Avatar uploaded to Cloudinary:", avatar?.url);
    
    
    const user = await User.create({
        fullname,
        username,
        password,
        avatar: avatar?.url || "",
        avatarPublicId: avatar?.public_id || "",
        email
    })


    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser)
        throw new ApiError(500, "Something went wrong while uploading");

    
    console.log("User Registered");
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User is Created")
        //new ApiResponse(200,"User is Created")
    );
})

const loginUser = asynchandler(async (req,res) => {
    const {username , email , password} = req.body;

    if(!(username || email)) {
        throw new ApiError(400,"Username or email required")
    }
    const user = await User.findOne({
        $or: [{username} , {email}] 
    })
    if(!user) {
        throw new ApiError(404,"User not found");
    }

    const validatePassword = await user.isPasswordCorrect(password);

    if(!validatePassword) {
        throw new ApiError(403,"Incorrect Password");
    }

    const {accessToken , refreshToken} = await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const Options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
    console.log("User Loggedin Successfully");

    return res.status(200).cookie("accessToken",accessToken,Options).cookie("refreshToken",refreshToken,Options).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken
            },
            
            "User loggedIn successfully"
        )
    )
   
})

const logoutUser = asynchandler(async (req,res) => {
    
    const updatedUser = await User.findByIdAndUpdate(
        req.auth._id,
        {
            $unset: {
                refreshToken: ""
            }
        },
        {
            new: true
        } 
    );

    //console.log(updatedUser);

    const Options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }

    return res.status(200).clearCookie("accessToken",Options).clearCookie("refreshToken",Options).json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )

})

const refreshAccessToken = asynchandler(async (req,res) => {
    
    const {user, incomingRefreshToken} = req.auth;

    if(incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401,"Refersh Token is Expired or used")
    }

    const Options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)
    console.log("access Token regenerated");

    res.status(200).cookie("accessToken", accessToken, Options).cookie("refreshToken", refreshToken, Options).json(
        new ApiResponse(
            200,
            {
                accessToken: accessToken
            },
            "Access Token Regenerated"
        )
        
    )

})

const changeCurrentPassword = asynchandler(async (req,res) => {

    const { oldpassword , newpassword , confpassword } = req.body;
    
    if(oldpassword === newpassword) {
        throw new ApiError(401,"Same Password");
    }

    if(!(newpassword === confpassword)) {
        return new ApiError(401,"Invalid Passwords")
    }
    
    const user = req.auth;
    const checkPassword = await user.isPasswordCorrect(oldpassword);
    
    if(!checkPassword) {
        throw new ApiError(401,"Incorrect Old Password");
    }

    user.password = newpassword;
    await user.save();

    console.log("Password Channged");

    res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
    
})

const updateDetails = asynchandler(async (req,res) => {
    const { username , email , fullname } = req.body; 
    const user = req.auth;

    if(fullname.trim() === "" || username.trim() === "" || email.trim() === "") {
        throw new ApiError(400, "All fields are required");
    } 
    if(!email.includes("@")) {
        throw new ApiError(404, "Invalid Email");
    }
    //if(user.fullname === fullname && user.username === username && user.email === email) {
    //    throw new ApiError(404, "Same Details")
    //}

    const existedUser = await User.findOne({
      $and: [
            { _id: { $ne: user._id } },       
            {
                $or: [
                    { email },                      
                    { username }                    
                ]
            }
        ]
    });

    if(existedUser)
        throw new ApiError(409, "User Already exists with this email or username")

    user.fullname = fullname;
    user.username = username;
    user.email = email;

    await user.save();
    console.log("User Updated");

    res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Details changed successfully"
        )
    )

})

const updateAvatar = asynchandler(async (req, res) => {
  
    //const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const avatarBuffer = req.files?.avatar?.[0]?.buffer;
    const user = req.auth;

    if (!avatarBuffer) {
        throw new ApiError(400, "Avatar file is required");
    }

    if (user.avatar) {
        await deleteFromCloudinary(user.avatarPublicId);
    }

    const uploadedAvatar = await uploadOnCloudianary(avatarBuffer);

    if (!uploadedAvatar) {
        throw new ApiError(500, "Avatar upload failed");
    }

    user.avatar = uploadedAvatar.url;
    user.avatarPublicId = uploadedAvatar.public_id;
    await user.save();
    console.log("Avatar Updated");
    res.status(200).json(
        new ApiResponse(
            200,
            { avatar: user.avatar }, 
            "Avatar updated successfully"
        )
    );
});

const getMe = asynchandler(async (req, res) => {
    const user = req.auth;
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    console.log("User is fetched");
    res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User details fetched successfully"
        )
    );   
})



export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateDetails,
    updateAvatar,
    getMe,
}