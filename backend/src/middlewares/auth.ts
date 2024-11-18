import 'dotenv/config'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../database'
import { RowDataPacket } from 'mysql2'
import bcrypt from 'bcrypt'

// Defining custom request
declare global {
    namespace Express {
        interface Request {
            accessToken?: string,
            refreshToken?: string,
            newAccessToken?: string
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
    
    console.log("\nChecking the client type...") // Debug.
    
    try {
        const clientType = req.headers['x-client-type']
        let accessToken: string | undefined
        let refreshToken: string | undefined
        
        
        if (clientType === 'web') {
            accessToken = req.cookies.accessToken
            refreshToken = req.cookies.refreshToken
        } else if (clientType === 'mobile') {
            // Fetch refresh token from header and checking the request input
            const refreshTokenHeader = req.headers['x-refresh-token'];
            if (Array.isArray(refreshTokenHeader)) {
                refreshToken = refreshTokenHeader[0]; // Use the first value if it's an array
            } else {
                refreshToken = refreshTokenHeader; // It's either a string or undefined
            }
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.split(' ')[1]
            }
        }

        // Check if there's an accessToken
        if (!accessToken) {
            // console.log("There's no access token.") // Debug.
            res.status(401).json({message: "Invalid access token."})
            return
        }

        // Check if there's refresh token
        if (!refreshToken) {
            // console.log("There's no refresh token.") // Debug.
            res.status(401).json({message: "Invalid refresh token."})
            return
        }

        // Set the access and refresh token
        req.accessToken = accessToken
        req.refreshToken = refreshToken
        
        console.log("Client type:", clientType) //Debug.
        console.log("Proceeding to check jwt...\n") //Debug.
        next()
    } catch (error) {
        console.error("Error fetching client type:", error)
        res.status(401).json({message: "Error fetching client type"})
    }
}

export async function jwtCheck(req: Request, res: Response, next: NextFunction) {
    console.log("Jwt checking...") //Debug.
    try {
        // console.log('Received cookies (jwtCheck):', req.cookies) // Debug.
        const accessToken = req.accessToken
        // console.log(token) (debuggin)
        if (accessToken && jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY as string)) {
            // console.log(token) // Debug.
            console.log('Successfully authenticating jwt. Proceeding to the controller...') //Debug.
            next()
        } else {
            // console.log("there's no access token") // Debug.
            res.status(401).json({message: "Unauthorized"})
            return
        }
    } catch (error) {
        console.log("Access token verification failed:", error) // Debug.

        if (error instanceof jwt.TokenExpiredError) {
            const refreshToken = req.refreshToken!
            try {
                // Decode the refresh token
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY as string) as jwt.JwtPayload

                // Check if the user has refresh token in the database
                const [user_hashed_refresh_token] = await pool.execute<RowDataPacket[]>('SELECT hashed_refresh_token FROM users_hashed_refresh_token WHERE user_id = ?', [decodedRefreshToken.user_id])
                if (user_hashed_refresh_token.length === 0) {
                    res.status(401).json({message: "Unauthorized."})
                    return
                }

                // Check if the refresh token is valid
                const isValidRefreshToken = await bcrypt.compare(refreshToken, user_hashed_refresh_token[0].hashed_refresh_token)
                if (isValidRefreshToken) {
                    // Generate new access token since the refresh token is valid
                        // Transferring the data from refresh token to the new access token
                    const user_id = decodedRefreshToken.user_id
                    const permissions = decodedRefreshToken.permissions
                    const newAccessToken = generateAccessToken({user_id, permissions})
                    
                    // Directly set the new access token to the cookie jar if the request comes from web
                    const clientType = req.headers['x-client-type']
                    if (clientType === 'web') {
                        res.cookie('accessToken', newAccessToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            maxAge: 15 * 60 * 1000,
                            path: '/'
                        })
                    } else {
                        // Passing the new access token to the controller to be sent as json data
                        req.newAccessToken = newAccessToken
                    }
                    console.log("Successfuly renewed the accessToken: ", newAccessToken, "\n") // Debug.
                    next()
                    
                } else {
                    res.status(401).json({ message: "Invalid refresh token." });
                    return
                }
            } catch (error) {
                console.error(error) // Debug.
                res.status(401).json({message: "Unauthorized"})
                return
            }
        } else {
            res.status(401).json({message: "Unauthorized."})
            return
        }
    }
}