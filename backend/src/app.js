import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

//Routes Import

import userRouter from "./routes/userroutes.js"
import vehicleRouter from "./routes/vehicleroutes.js"
import adminRouter from "./routes/adminroutes.js"
import slotRouter from "./routes/parkingslotroutes.js"
import bookingRouter from "./routes/bookingroutes.js"
import { errorHandler } from "./middleware/errormiddleware.js"


//Routes declaration
app.use("/api/users", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/vehicle",vehicleRouter)
app.use("/api/slots",slotRouter)
app.use("/api/booking",bookingRouter)



app.use(errorHandler);



export { app }