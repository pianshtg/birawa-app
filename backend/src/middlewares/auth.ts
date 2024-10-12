import 'dotenv/config'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            accessToken?: string
        }
    }
}

export function generateAccessToken (data: any) {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY as string, {expiresIn: '15m'})
}

export function generateRefreshToken (data: any) {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY as string, {expiresIn: '7d'})
}

export async function clientType(req: Request, res:Response, next: NextFunction) {
    try {
        const clientType = req.headers['x-client-type']
        let accessToken: string | undefined

        if (clientType === 'web') {
            accessToken = req.cookies.accessToken

        } else if (clientType === 'mobile') {
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.split(' ')[1]

            }
        }

        if (!accessToken) {
            res.status(401).json({message: "Invalid access token."})
        }

        req.accessToken = accessToken

        next()
        
    } catch (error) {
        console.error("Error fetching client type:", error)
        res.status(401).json({message: "Error fetching client type"})
    }
}

export async function jwtCheck(req: Request, res: Response, next: NextFunction) {
    try {
        // console.log('Received cookies (jwtCheck):', req.cookies)
        const token = req.cookies.accessToken
        // console.log(token)
        if (token && jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string)) {
            // console.log(token)
            next()
        } else {
            // console.log("there's no token")
            res.status(401).json({message: "Unauthorized"})
            return
        }
    } catch (error) {
        console.error(error)
        res.status(401).json({message: "Unauthorized"})
        return
    }
}