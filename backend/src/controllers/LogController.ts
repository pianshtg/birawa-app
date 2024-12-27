import { Request, Response } from "express"
import { pool } from "../database"
import { RowDataPacket } from "mysql2"
import jwt from 'jsonwebtoken'

async function getLoggings(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        // console.log("Access token received:", accessToken) // Debug.
        const newAccessToken = req.newAccessToken
        // console.log("New access token received:", newAccessToken) // Debug.
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        // console.log(metaData) // Debug.
        const permissions = metaData.permissions
        const isAdmin = !metaData.nama_mitra

        // Check the user permission
        if (isAdmin && permissions.includes('view_logs')) {
            const [logs] = await pool.execute<RowDataPacket[]>('SELECT users.email, log.id, log.rekaman_id, log.nama_tabel, log.perubahan, log.aksi, log.created_at FROM log JOIN users ON log.user_id = users.id ORDER BY log.created_at DESC LIMIT 100')
            if (logs.length > 0) {
                res.status(200).json({
                    message: "Successfully retrieved latest 100 logs.",
                    logs,
                    newAccessToken
                })
                return
            }
        } else {
            res.status(401).json({message: "Unauthorized."})
            return
        }
    } catch (error) {
        console.error(error) // Debug.
        res.status(500).json({message: "Error getting logs."})
        return
    }
}

export default {
    getLoggings
}