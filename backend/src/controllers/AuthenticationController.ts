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
                
                // Checking user's mitra
                const [mitra] = await pool.execute<RowDataPacket[]>('SELECT mitra.nama FROM mitra_users INNER JOIN mitra ON mitra_users.mitra_id = mitra.id INNER JOIN users ON mitra_users.user_id = users.id WHERE users.id = ?', [user_id])
                let nama_mitra: string | undefined
                if (mitra.length > 0) {
                    nama_mitra = mitra[0].nama
                }
                // Generate access and refresh token
                const accessToken = generateAccessToken({user_id, permissions, nama_mitra})
                const refreshToken = generateRefreshToken({user_id, permissions, nama_mitra})

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
                        secure: true,
                        sameSite: 'none',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
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

async function logoutUser (req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        // console.log("Access token received:", accessToken) // Debug.
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        const user_id = metaData.user_id
        
        await pool.execute('DELETE FROM users_hashed_refresh_token WHERE user_id = ?', [user_id])
        
        const clientType = req.headers['x-client-type']
        if (clientType === 'web') {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
        }
        
        res.status(200).json({message: "Successfully logged out user."})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to log out."})
        return;
    }
}

async function authenticateUser(req: Request, res: Response) {
    console.log("Jwt checking...") //Debug.
    try {
        // console.log('Received cookies (jwtCheck):', req.cookies) // Debug.
        const accessToken = req.accessToken
        // console.log(token) (debuggin)
        if (accessToken && jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY as string)) {
            // console.log(token) // Debug.
            console.log('Successfully authenticating jwt.') //Debug.
            res.status(201).json({message: "User successfully authenticated."})
            return
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
                    
                    // Checking user's mitra
                    const [mitra] = await pool.execute<RowDataPacket[]>('SELECT mitra.nama FROM mitra_users INNER JOIN mitra ON mitra_users.mitra_id = mitra.id INNER JOIN users ON mitra_users.user_id = users.id WHERE users.id = ?', [user_id])
                    let nama_mitra: string | undefined
                    if (mitra.length > 0) {
                        nama_mitra = mitra[0].nama
                    }
                    
                    const newAccessToken = generateAccessToken({user_id, permissions, nama_mitra})
                    
                    console.log("Successfuly renewed the accessToken: ", newAccessToken, "\n") // Debug.
                    
                    // Directly set the new access token to the cookie jar if the request comes from web
                    const clientType = req.headers['x-client-type']
                    if (clientType === 'web') {
                        res.cookie('accessToken', newAccessToken, {
                            secure: true,
                            sameSite: 'none',
                            maxAge: 15 * 60 * 1000,
                            path: '/'
                        })
                        res.status(201).json({message: "User successfully authenticated."})
                        return
                    } else {
                        // Passing the new access token to user
                        res.status(201).json({
                            message: "User successfully authenticated.",
                            newAccessToken
                        })
                        return
                    }
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
            console.error(error) //Debug.
            res.status(401).json({message: "Unauthorized."})
            return
        }
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
    logoutUser,
    authenticateUser,
    verifyEmail
}