
import mongoose from "mongoose";
import connectDB from "./db/db.js";
import {app} from "./app.js";
import dotenv from "dotenv"

dotenv.config({
    path: './.env' 
})





connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ",err);
})







/*
const app = express()

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}?${process.env.MONGODB_URI2}`)
        app.on("errror", (error) => {
            console.log("ERRR: ",error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch(error) {
        console.log("Error: ",error);
        throw err
    }
})()

*/