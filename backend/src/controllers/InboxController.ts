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
        const nama_mitra: string | undefined = metaData.nama_mitra

        // Check the user permission
        if (permissions.includes('create_inbox')) {
            // Get request parameter.
            const {email_receiver, subject, content} = req.body
            
            // Check if chatters exist.
            const [existingChatters] = await pool.execute<RowDataPacket[]>('SELECT id, email, nama_lengkap FROM users WHERE id = ? OR email = ?', [sender_id, email_receiver])
            console.log(existingChatters) //Debug.
            if (existingChatters.length !== 2) {
                res.status(409).json({message: "Communication cannot be started, invalid sender or receiver."})
                return
            }
            
            // Checking chatters rules
            if (nama_mitra) {
                const [existingMitra] = await pool.execute<RowDataPacket[]>('SELECT mitra.nama FROM mitra_users INNER JOIN mitra ON mitra_users.mitra_id = mitra.id INNER JOIN users ON mitra_users.user_id = users.id WHERE users.email = ?', [email_receiver!])
                if (existingMitra.length > 0) {
                    res.status(401).json({message: "Mitra is not allowed to send message to another mitra."})
                    return
                }
            } else {
                const [existingMitra] = await pool.execute<RowDataPacket[]>('SELECT mitra.nama FROM mitra_users INNER JOIN mitra ON mitra_users.mitra_id = mitra.id INNER JOIN users ON mitra_users.user_id = users.id WHERE users.email = ?', [email_receiver!])
                if (existingMitra.length === 0) {
                    res.status(401).json({message: "Admin is not allowed to send message to another admin."})
                    return
                }
            }
            
            // Insert the inbox
            const inboxId = uuidv4()
            const receiver_id = existingChatters.filter((user) => user.email === email_receiver)[0].id
            await pool.execute('INSERT INTO inbox (id, sender_id, receiver_id, judul, isi, created_by) VALUES (?, ?, ?, ?, ?, ?)', [inboxId, sender_id, receiver_id, subject, content, sender_id])
            
            // Debug.
            res.status(201).json({
                message: "Inbox created successfully.",
                created_inbox: {
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
        const accessToken = req.accessToken
        // console.log("Access token received:", accessToken) // Debug.
        const newAccessToken = req.newAccessToken
        // console.log("New access token received:", newAccessToken) // Debug.
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        // console.log(metaData) // Debug.
        const permissions = metaData.permissions

        // Check the user permission
        if (permissions.includes('create_inbox')) { // don't forget to change the permission (get_inboxes)
            // Get nama_mitra
            const nama_mitra = metaData.nama_mitra || req.body.nama_mitra
            if (!nama_mitra) {
                res.status(400).json({message: "Nama mitra is required."})
                return
            } else if (metaData.nama_mitra && req.body.nama_mitra && metaData.nama_mitra != req.body.nama_mitra) {
                res.status(401).json({message: "Unauthorized."})
                return
            }
            
            let inboxes
            
            const [existingMitraUsers] = await pool.execute<RowDataPacket[]>('SELECT user_id FROM mitra_users INNER JOIN mitra ON mitra_users.mitra_id = mitra.id WHERE mitra.nama = ?', [nama_mitra])
            if (existingMitraUsers.length > 0) {
                // Get inboxes
                const existingMitraUsersId = existingMitraUsers.map(user => user.user_id);
                const placeholders = existingMitraUsersId.map(() => '?').join(', ');
                const dynamicQuery = `
                    WITH latest_message AS (
                        SELECT judul, MAX(created_at) AS latest_created_at
                        FROM inbox
                        WHERE sender_id IN (${placeholders}) OR receiver_id IN (${placeholders})
                        GROUP BY judul
                    )
                    SELECT i.judul, i.isi AS last_message, i.created_at
                    FROM inbox i
                    INNER JOIN latest_message lm
                    ON i.judul = lm.judul AND i.created_at = lm.latest_created_at
                `;
                const [rows] = await pool.execute<RowDataPacket[]>(dynamicQuery, [...existingMitraUsersId, ...existingMitraUsersId]);
                inboxes = rows
                console.log("Inboxes:", inboxes) //Debug.
                console.log('Existing mitra users:', existingMitraUsersId) //Debug.
            } else {
                console.log(existingMitraUsers) //Debug.
                res.status(409).json({message: "Failed to find any of mitra's user."})
                return
            }
            
            // Debug.
            res.status(201).json({
                message: "Inbox created successfully.",
                inboxes,
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