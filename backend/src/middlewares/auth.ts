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

export async function clientType(req: Request, res: Response, next: NextFunction) {
        
    try {
        const clientType = req.headers['x-client-type']
        let accessToken: string | undefined
        let refreshToken: string | undefined
        
        if (clientType === 'web') {
            accessToken = req.cookies.accessToken
            refreshToken = req.cookies.refreshToken
        } else if (clientType === 'mobile') {
            // Fetch refresh token from header and checking the request input
            const refreshTokenHeader = req.headers['x-refresh-token']
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

        // Check if there's refresh token
        if (!refreshToken) {
            res.status(401).json({message: "Invalid refresh token."})
            return
        }

        // Set the access and refresh token
        req.accessToken = accessToken
        req.refreshToken = refreshToken
        
        next()
        
    } catch (error) {
        console.error("Error fetching client type:", error)
        res.status(401).json({message: "Error fetching client type"})
    }
}

export async function jwtCheck(req: Request, res: Response, next: NextFunction) {

    try {
        const accessToken = req.accessToken

        // If there's an access token, validate it normally
        if (accessToken && jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY as string)) {
            next()
        } else {
            let refreshToken = req.refreshToken
            if (refreshToken) {
                // If no access token but there is a refresh token, we try to renew the access token
                // Decode the refresh token
                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY as string) as jwt.JwtPayload;
    
                    // Check if the user has the refresh token in the database
                    const [user_hashed_refresh_token] = await pool.execute<RowDataPacket[]>('SELECT hashed_refresh_token FROM users_hashed_refresh_token WHERE user_id = ?', [decodedRefreshToken.user_id]);
                    if (user_hashed_refresh_token.length === 0) {
                        res.status(401).json({ message: "Unauthorized." });
                        return
                    }
    
                    // Compare the refresh token to the one stored in the database
                    const isValidRefreshToken = await bcrypt.compare(refreshToken, user_hashed_refresh_token[0].hashed_refresh_token);
                    if (!isValidRefreshToken) {
                        res.status(401).json({ message: "Invalid refresh token." });
                        return
                    }
    
                    // If valid, generate a new access token
                    const user_id = decodedRefreshToken.user_id;
                    const permissions = decodedRefreshToken.permissions;
                    const nama_mitra = decodedRefreshToken.nama_mitra || undefined;
    
                    // Create a new access token
                    const newAccessToken = generateAccessToken({ user_id, permissions, nama_mitra });
    
                    // Set the new access token in the cookie for web clients
                    const clientType = req.headers['x-client-type'];
                    if (clientType === 'web') {
                        res.cookie('accessToken', newAccessToken, {
                            secure: process.env.ENVIRONMENT as string === 'production',
                            sameSite: process.env.ENVIRONMENT as string === 'production' ? 'none' : 'lax',
                            maxAge: 15 * 60 * 1000,  // 15 minutes
                            path: '/'
                        });
                    } else {
                        // If mobile, send the new access token in the response body
                        req.newAccessToken = newAccessToken;
                    }
    
                    next(); // Proceed to the next middleware or controller
                    
                } catch (error) {
                    res.status(401).json({ message: "Unauthorized." });
                    return
                }
            } else {
                res.status(401).json({ message: "Unauthorized." });
                return
            }
        }
        
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            let refreshToken = req.refreshToken
            if (refreshToken) {
                // If no access token but there is a refresh token, we try to renew the access token
                // Decode the refresh token
                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY as string) as jwt.JwtPayload;
    
                    // Check if the user has the refresh token in the database
                    const [user_hashed_refresh_token] = await pool.execute<RowDataPacket[]>('SELECT hashed_refresh_token FROM users_hashed_refresh_token WHERE user_id = ?', [decodedRefreshToken.user_id]);
                    if (user_hashed_refresh_token.length === 0) {
                        res.status(401).json({ message: "Unauthorized." });
                        return
                    }
    
                    // Compare the refresh token to the one stored in the database
                    const isValidRefreshToken = await bcrypt.compare(refreshToken, user_hashed_refresh_token[0].hashed_refresh_token);
                    if (!isValidRefreshToken) {
                        res.status(401).json({ message: "Invalid refresh token." });
                        return
                    }
    
                    // If valid, generate a new access token
                    const user_id = decodedRefreshToken.user_id;
                    const permissions = decodedRefreshToken.permissions;
                    const nama_mitra = decodedRefreshToken.nama_mitra || undefined;
    
                    // Create a new access token
                    const newAccessToken = generateAccessToken({ user_id, permissions, nama_mitra });
    
                    // Set the new access token in the cookie for web clients
                    const clientType = req.headers['x-client-type'];
                    if (clientType === 'web') {
                        res.cookie('accessToken', newAccessToken, {
                            secure: process.env.ENVIRONMENT as string === 'production',
                            sameSite: process.env.ENVIRONMENT as string === 'production' ? 'none' : 'lax',
                            maxAge: 15 * 60 * 1000,  // 15 minutes
                            path: '/'
                        });
                    } else {
                        // If mobile, send the new access token in the response body
                        req.newAccessToken = newAccessToken;
                    }
    
                    next(); // Proceed to the next middleware or controller
                    
                } catch (error) {
                    res.status(401).json({ message: "Unauthorized." });
                    return
                }
            } else {
                res.status(401).json({ message: "Unauthorized." });
                return
            }
        }
        
    }
}
