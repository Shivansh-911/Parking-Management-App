import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/*
const uploadImageOnCloudinary = async (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
*/

const uploadOnCloudianary = async (localFilePath) => {

    try {
        if(!localFilePath) return null
        //console.log("ll")
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        console.log("file is uploaded on cloudinary",result.url);
        fs.unlinkSync(localFilePath)
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("ERROR: ",error) 
        return null; 
    }
};


const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
    }
};


export { uploadOnCloudianary , deleteFromCloudinary}
