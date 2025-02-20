import "dotenv/config";
import express, { Request, Response } from 'express'
import {v2 as cloudinary} from 'cloudinary'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { csrfProtection } from './middlewares/csurf'
import authenticationRoute from './routes/AuthenticationRoute'
import testRoute from './routes/_TestRoute'
import mitraRoute from './routes/MitraRoute'
import kontrakRoute from './routes/KontrakRoute'
import userRoute from './routes/UserRoute'
import laporanRoute from './routes/LaporanRoute'
import inboxRoute from './routes/InboxRoute'
import logRoute from './routes/LogRoute'
import { clientType, jwtCheck } from './middlewares/auth'
import { testConnection } from './database'

const app = express()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middlewares
app.use(helmet())
app.use(express.json())
app.use(cors({
    origin:['http://localhost:5173'],
    credentials: true
}))
app.use(cookieParser())
app.use(csrfProtection)

// Health Check
app.get("/", async (req: Request, res: Response) => {
    res.json({message: "Hi!"})
})

// Test Route
app.use("/api/test", testRoute)

// Routes
app.use("/api/auth", authenticationRoute)
app.use("/api/mitra", clientType, jwtCheck, mitraRoute)
app.use("/api/kontrak", clientType, jwtCheck, kontrakRoute)
app.use("/api/user", clientType, jwtCheck, userRoute)
app.use("/api/laporan", clientType, jwtCheck, laporanRoute)
app.use("/api/inbox", clientType, jwtCheck, inboxRoute)
app.use("/api/log", clientType, jwtCheck, logRoute)

// Start Server
async function startServer() {
    try {
        await testConnection()
        app.listen(3030, () => {
            console.log("Server started on localhost:3030..")
        })
    } catch (error) {
        console.error("Failed to connect database. Server is failed to start: ", error)
    }
}

startServer()