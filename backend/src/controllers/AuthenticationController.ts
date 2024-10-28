import 'dotenv/config'
import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import { generateAccessToken, generateRefreshToken } from '../middlewares/auth';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


async function loginUser (req: Request, res: Response) {
    try {
        const {email, password} = req.body
        const clientType = req.headers['x-client-type']
        
        if (clientType) {

            const [user] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email])
    
            // Check if user existed
            if (user.length === 0) {
                res.status(409).json({message: "Account doesn't exist."})
                return;
            }
            
            // Check if user is verified
            if (!user[0].is_verified) {
                res.status(409).json({message: "Account hasn't been verified. Check your email to verify account."})
                return;
            }
            
            // Check if password existed
            const [hashed_password] = await pool.execute<RowDataPacket[]>("SELECT hashed_password FROM users_hashed_password WHERE user_id = ?", [user[0].id])
            if (hashed_password.length === 0) {
                res.status(500).json({ message: "Password not found for user." });
                return;
            }
            
            // Check the password
            const isAuthenticated = await bcrypt.compare(password, hashed_password[0].hashed_password)
            // const isAuthenticated = true
            
            if (isAuthenticated) {

                // Creating user permissions based on user's role
                const user_id = user[0].id
                const [permissionsArray] = await pool.execute<RowDataPacket[]>("SELECT nama FROM permissions WHERE role_id = ?", [user[0].role_id])
                const permissions: string[] = permissionsArray.map((permission) => permission.nama)
                
                // Generate access and refresh token
                const accessToken = generateAccessToken({user_id, permissions})
                const refreshToken = generateRefreshToken({user_id, permissions})

                // Hash the refresh token and set its expiry
                const hashed_refresh_token = await bcrypt.hash(refreshToken, 10)
                const expires_at = Date.now() + 7 * 24 * 60 * 60 * 1000

                // Insert the hashed refresh token into the database -- users_hashed_refresh_token table
                await pool.execute('INSERT INTO users_hashed_refresh_token (user_id, hashed_refresh_token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE hashed_refresh_token = VALUES (hashed_refresh_token), expires_at = VALUES (expires_at)', [user_id, hashed_refresh_token, expires_at])
                
                // Check the client device type to set the access and refresh token
                if (clientType === 'mobile') {
                    
                    res.status(201).json({
                        message: "Successfully authenticated.",
                        accessToken,
                        refreshToken,
                        permissions
                    })
                    return;
    
                } else {
                    
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 15 * 60 * 1000,
                        path: '/'
                    })
    
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        path: '/'
                    })
    
                    res.status(201).json({
                        clientType, 
                        accessToken,
                        refreshToken,
                        hashed_refresh_token,
                        user_id,
                        permissions
                    })
                    return;
                }   

            } else {
                res.status(401).json({message: "Email or password is wrong."})
                return;
            } // Wrong password
        } else {
            res.status(401).json({message: "Unauthorized."})
            return;
        } // No client type
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to authenticate."})
        return;
    }
}

async function authenticateUser(req: Request, res: Response) {
    try {
        // console.log('Received Cookies:', req.cookies); (debugging)
        const accessToken = req.accessToken;
        if (accessToken && jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY as string)) {
            res.status(201).json({message: 'Access token is valid.'}) //dont forget to delete json
            return
        } else {
            const refreshToken = req.cookies.refreshToken
            if (refreshToken) {
                const verifiedRefreshToken =  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY as string) as jwt.JwtPayload
                if (verifiedRefreshToken) {
                    const [hashed_refresh_token] = await pool.execute<RowDataPacket[]>('SELECT hashed_refresh_token FROM user_token WHERE user_id = ?', [verifiedRefreshToken.user_id])
                    if (hashed_refresh_token.length > 0) {
                        const user_id = verifiedRefreshToken.user_id
                        const newAccessToken = generateAccessToken({user_id})
                        res.cookie('accessToken', newAccessToken, {
                            httpOnly: true,
                            secure: (process.env.NODE_ENV as string) === 'production',
                            sameSite: 'none',
                            maxAge: 15 * 60 * 1000, // 15 minutes
                            path: '/'
                        })
                        res.status(201).json({message: 'Token renewed!'})
                        return
                    } else {
                        console.log('invalid refresh token (database)')
                        res.status(401).json({message: "Refresh token doesn't exist in the database."})
                        return
                    }
                } else {
                    console.log('invalid refresh token')
                    res.status(401).json({message: 'Invalid refresh token'})
                    return
                }
            } else {
                console.log("There's no refresh token")
                res.status(401).json({message :"Refresh token expired"})
                return
            }
        }
    } catch (error) {
        console.error('JWT Check Error:', error); // Log detailed error
        res.status(401).json({ message: 'Invalid token' }); //don't forget to reevaluate the json
        return
    }
}

async function verifyEmail(req: Request, res: Response) {
    const {token} = req.query
    try {
        const [user] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE verification_token = ?', [token])

        if (user.length === 0) {
            res.status(400).json({message: 'Invalid token.'})
            return
        }

        await pool.execute('UPDATE users SET is_verified = ?, verification_token = NULL WHERE id = ?', [1, user[0].id])

        res.status(200).json({message: "Email verified successfully. Please log in."})
        return

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to verify email.' })
        return
    }
}

export default {
    loginUser,
    authenticateUser,
    verifyEmail
}