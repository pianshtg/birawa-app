import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import { testConnection } from './database'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

const app = express()

// Middleware
app.use(helmet())
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
// app.use(csrfProtection)

app.get("/", async (req: Request, res: Response) => {
    res.json({message: 'Hello!'})
})

// Routes

// Start Server
async function startServer() {
    try {
        await testConnection()
        app.listen(3030, () => {
            console.log("Server started on localhost:3030!")
        })
    } catch (err) {
        console.error("Failed to connect database. Server is failed to start.", err)
    }
}

startServer()