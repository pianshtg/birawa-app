import 'dotenv/config'
import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

async function createUser(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        // console.log("Access token received:", accessToken) (debugging)
        const newAccessToken = req.newAccessToken
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        // console.log(metaData) (debugging)
        const permissions = metaData.permissions
        const creator_id = metaData.user_id

        if (permissions.includes('manage_users')) { // don't forget to further specify the role's permissions
            const {nama_lengkap, email, nomor_telepon, mitra_nama} = req.body

            // Validate request input
            if (!nama_lengkap || !email || !nomor_telepon || !mitra_nama) {
                res.status(400).json({message: "Missing nama lengkap, email, nomor telepon, or nama mitra."})
                return
            }
            
            // Checking if mitra exists
            const [mitra] = await pool.execute<RowDataPacket[]>('SELECT id FROM mitra WHERE nama = ?', [mitra_nama])
            if (mitra.length === 0) {
                res.status(409).json({message : "Mitra doesn't exist."})
                return
            }

            // Check if user exists
            const [user] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email])
            console.log(user)
            if (user.length > 0) {
                res.status(409).json({message: "User already exists."})
                return;
            }
            
            // Insertion of created user to users table
            const user_id = uuidv4()
            const verificationToken = uuidv4()
            await pool.execute('INSERT INTO users (id, role_id, email, nama_lengkap, nomor_telepon, verification_token, created_by) VALUES (?, (SELECT id FROM roles WHERE nama = "mitra"), ?, ?, ?, ?, ?)', [user_id, email, nama_lengkap, nomor_telepon, verificationToken, creator_id])
            
            // Insertion of user's generated password
            const new_password = uuidv4()
            const hashed_new_password = await bcrypt.hash(new_password, 10)
            await pool.execute('INSERT INTO users_hashed_password (user_id, hashed_password, created_by) VALUES (?, ?, ?)', [user_id, hashed_new_password, creator_id])

            // Insertion of created user into mitra_users table
            const mitra_id = mitra[0].id
            const mitra_users_id = uuidv4()
            await pool.execute('INSERT INTO mitra_users (id, mitra_id, user_id, created_by) VALUES (?, ?, ?, ?)', [mitra_users_id, mitra_id, user_id, creator_id])
        
            // Delivering the verification email to the user process
                // Creating the transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.TRANSPORTER_EMAIL as string,
                    pass: process.env.TRANSPORTER_PASSWORD as string
                }
            })
                // Creating the verification token and url
            const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`

                // Sending the email
            await transporter.sendMail({
                from: process.env.TRANSPORTER_EMAIL as string,
                to: email,
                subject: "Email Verification",
                html: `<h1>Please verify your email by clicking on the following link:<br></h1><a href="${verificationUrl}"><h2>Verify Email</h2></a><h3>Password: <b>${new_password}</b></h3>`
            })

            res.status(201).json({
                message: "User created successfully. Check the email verification to verify the account.",
                created_user: {
                    mitra_nama,
                    mitra_id,
                    user_id,
                    nama_lengkap,
                    email,
                    newAccessToken
                }
            })
            return

        } else {
            res.status(401).json({message: "Unauthorised."})
            return
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error creating the user."})
        return
    }

}

async function getUser(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        const [user] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [metaData.user_id])

        if (user.length === 0) {
            // console.log("User doesn't exist.") //Debug
            res.status(409).json({message: "User not found."})
            return
        } else {
            // console.log(user) //Debug
            res.status(200).json({
                user
            })
            return
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error reading User."})
        return
    }
}

export default {
    createUser,
    getUser,
}