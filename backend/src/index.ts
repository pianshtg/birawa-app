import express, { Request, Response } from 'express'
import { testConnection } from './database'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { csrfProtection } from './middlewares/csurf'
import authenticationRoute from './routes/AuthenticationRoute'
import testRoute from './routes/TestRoute'
import mitraRoute from './routes/MitraRoute'
import kontrakRoute from './routes/KontrakRoute'
import pekerjaanRoute from './routes/PekerjaanRoute'
import userRoute from './routes/UserRoute'

const app = express()

// Middlewares
app.use(helmet())
app.use(express.json())
// app.use(cors({
//     origin:'http://localhost:5173',
//     credentials: true
// }))
app.use(cookieParser())
// app.use(csrfProtection)

// Health Check
app.get("/", async (req: Request, res: Response) => {
    res.json({message: "Hi!"})
})

//Routes
app.use("/api/auth", authenticationRoute)
app.use("/api/test", testRoute)
app.use("/api/mitra", mitraRoute)
app.use("/api/kontrak", kontrakRoute)
app.use("/api/pekerjaan", pekerjaanRoute)
app.use("/api/user", userRoute)

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