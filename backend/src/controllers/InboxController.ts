import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'


async function createInbox(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        // console.log("Access token received:", accessToken) // Debug.
        const newAccessToken = req.newAccessToken
        // console.log("New access token received:", newAccessToken) // Debug.
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        // console.log(metaData) // Debug.
        const permissions = metaData.permissions
        const sender_id = metaData.user_id
        
        // Checking user's mitra
        const [mitra] = await pool.execute<RowDataPacket[]>('SELECT mitra.nama FROM mitra_users INNER JOIN mitra ON mitra_users.mitra_id = mitra.id INNER JOIN users ON mitra_users.user_id = users.id WHERE users.id = ?', [sender_id])
        let nama_mitra: string | undefined
        if (mitra.length > 0) {
            nama_mitra = mitra[0].nama
        }

        // Check the user permission
        if (permissions.includes('create_inbox')) {
            // Get request parameter.
            const {email_receiver, subject, content} = req.body
            
            // Check if chatters exist.
            const [existingChatters] = await pool.execute<RowDataPacket[]>('SELECT id, nama_lengkap FROM users WHERE id = ? OR email = ?', [sender_id, email_receiver])
            console.log(existingChatters)
            if (existingChatters.length !== 2) {
                res.status(409).json({message: "Communication cannot be started, invalid sender or receiver."})
                return
            }
            
            // Insert the inbox
            const inboxId = uuidv4()
            await pool.execute('INSERT INTO inbox (id, sender_id, receiver_id, judul, isi, created_by) VALUES (?, ?, (SELECT id FROM users WHERE email = ?), ?, ?, ?)', [inboxId, sender_id, email_receiver, subject, content, sender_id])
            
            // Debug.
            res.status(201).json({
                message: "Inbox created successfully.",
                created_kontrak: {
                    sender_id,
                    email_receiver,
                    subject,
                    content
                },
                newAccessToken
            })
            return
        } else {
            // User doesn't have the permission.
            res.status(401).json({message: "Unauthorized."})
            return
        }
        
    } catch (error) {
        console.error(error) //Debug.
        res.status(500).json({message: "Error creating inbox."})
        return
    }
}

async function getInboxes(req: Request, res: Response) {
    try {
        
    } catch (error) {
        console.error(error) //Debug.
        res.status(500).json({message: "Error getting inboxes."})
        return
    }
}

async function getInbox(req: Request, res: Response) {
    try {
        
    } catch (error) {
        console.error(error) //Debug.
        res.status(500).json({message: "Error getting inbox."})
        return
    }
}

export default {
    createInbox,
    getInboxes,
    getInbox
}