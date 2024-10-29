import { Request, Response } from "express"
import { pool } from "../database"
import jwt from 'jsonwebtoken'
import { RowDataPacket } from "mysql2"
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

type Pekerjaan = {
    nama: string,
    lokasi: string
}

async function createMitra (req: Request, res: Response) {
    const connection = await pool.getConnection()
    try {
        
        const accessToken = req.accessToken
        // console.log("Access token received:", accessToken) (debugging)
        const newAccessToken = req.newAccessToken
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        // console.log(metaData) (debugging)
        const permissions = metaData.permissions
        const creator_id = metaData.user_id

        if (permissions.includes('manage_users')) {
            await connection.beginTransaction()
            const {mitra, kontrak, pekerjaan, user} = req.body
    
            // Creating mitra.
            const [existingMitra]= await connection.execute<RowDataPacket[]>('SELECT * FROM mitra WHERE nama = ?', [mitra.nama])
            
            if (existingMitra.length > 0) {
                res.status(409).json({message: 'Mitra already exists.'})
                return
            }
            
            const mitraId = uuidv4()
            await connection.execute('INSERT INTO mitra (id, nama, nomor_telepon, alamat, created_by) VALUES (?, ?, ?, ?, ?)', [mitraId, mitra.nama, mitra.nomor_telepon, mitra.alamat, creator_id])
            console.log("Mitra successfully created:", mitraId, mitra) //Debug.
            
            // Creating kontrak
            const kontrakId = uuidv4()
            await connection.execute('INSERT INTO kontrak (id, mitra_id, nama, nomor, tanggal, nilai, jangka_waktu, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [kontrakId, mitraId, kontrak.nama, kontrak.nomor, kontrak.tanggal, kontrak.nilai, kontrak.jangka_waktu, creator_id])
            console.log("Kontrak successfully created:", kontrakId, kontrak)
    
            // Creating pekerjaan
            await Promise.all(
                pekerjaan.map(async (_pekerjaan: Pekerjaan) => {
                    const pekerjaanId = uuidv4()
                    await connection.execute('INSERT INTO kontrak_ss_pekerjaan (id, kontrak_id, nama, lokasi, created_by) VALUES (?, ?, ?, ?, ?)', [pekerjaanId, kontrakId, _pekerjaan.nama, _pekerjaan.lokasi, creator_id])
                    console.log(`Pekerjaan "${_pekerjaan.nama}" di "${_pekerjaan.lokasi}" successfully created.`) //Debug.
                })
            )
            console.log("Pekerjaan successfully created:", pekerjaan) //Debug.
    
            // Creating user
                //Checking if the user is already exists.
                const [existingUser] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [user.email])
                if (existingUser.length > 0) {
                    res.status(409).json({message: "User already exists."})
                    return
                }
                
                // Assign id to user and insert it into the database.
            const userId = uuidv4()
            const verificationToken = uuidv4()
            await connection.execute('INSERT INTO users (id, role_id, email, nama_lengkap, nomor_telepon, verification_token, created_by) VALUES (?, (SELECT id FROM roles WHERE nama = "mitra"), ?, ?, ?, ?, ?)', [userId, user.email, user.nama_lengkap, user.nomor_telepon, verificationToken, creator_id])
    
                // Generate password and insert it into the database.
            const password = uuidv4()
            const hashed_password = await bcrypt.hash(password, 10)
            await pool.execute('INSERT INTO users_hashed_password (user_id, hashed_password, created_by) VALUES (?, ?, ?)', [userId, hashed_password, creator_id])
    
                // Generate mitra_users id and insert it into the database.
            const mitraUsersId = uuidv4()
            await connection.execute('INSERT INTO mitra_users (id, mitra_id, user_id, created_by) VALUES (?, ?, ?, ?)', [mitraUsersId, mitraId, userId, creator_id])
    
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
                to: user.email,
                subject: "Email Verification",
                html: `<h1>Please verify your email by clicking on the following link:<br></h1><a href="${verificationUrl}"><h2>Verify Email</h2></a><h3>Password: <b>${password}</b></h3>`
            })
    
            res.status(201).json({
                message: "Mitra created successfully. Check the email verification to verify the user account.",
                created_mitra: mitra,
                created_kontrak: kontrak,
                created_pekerjaan: pekerjaan,
                created_user: user,
                newAccessToken
            })
            return
        } else {
            res.status(401).json({message: "Unauthorised."})
            return
        }
    } catch (error) {
        await connection.rollback()
        console.error(error)
        res.status(500).json({message: "Error creating Mitra."})
        return
        
    } finally {
        connection.release()
    }
}

async function getMitra(req: Request, res: Response) {}

async function getMitras(req: Request, res: Response) {}

async function updateMitra (req: Request, res: Response) {}

async function deleteMitra (req: Request, res: Response) {}

export default {
    createMitra,
    getMitra,
    getMitras,
    updateMitra,
    deleteMitra
}