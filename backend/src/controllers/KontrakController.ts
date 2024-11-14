import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'

async function createKontrak(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        // console.log("Access token received:", accessToken) // Debug.
        const newAccessToken = req.newAccessToken
        // console.log("New access token received:", newAccessToken) // Debug.
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        // console.log(metaData) // Debug.
        const permissions = metaData.permissions
        const creator_id = metaData.user_id

        // Check the user permission
        if (permissions.includes('create_kontrak')) { // don't forget to change the permissions
        
            // Get request parameter.
            const {nama_mitra, nama, nomor, tanggal, nilai, jangka_waktu} = req.body

            // Check if mitra exists.
            const [_mitra] = await pool.execute<RowDataPacket[]>('SELECT id FROM mitra WHERE nama = ?', [nama_mitra])
            if (_mitra.length === 0) {
                res.status(409).json({message: "Mitra doesn't exist"})
                return
            }

            // Insert kontrak into the database.
            const id = uuidv4()
            await pool.execute('INSERT INTO kontrak (id, mitra_id, nama, nomor, tanggal, nilai, jangka_waktu, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, _mitra[0].id, nama, nomor, tanggal, nilai, jangka_waktu, creator_id])
            
            // Debug.
            res.status(201).json({
                message: "Kontrak created successfully.",
                created_kontrak: {
                    nama_mitra,
                    id,
                    nama,
                    nomor,
                    tanggal,
                    nilai,
                    jangka_waktu
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
        console.error(error) // Debug.
        res.status(500).json({message: "Error creating Kontrak."})
        return
    }
}

async function getKontrak(req: Request, res: Response) {}

async function updateKontrak(req: Request, res: Response) {}

async function deleteKontrak(req: Request, res: Response) {}

export default {
    createKontrak,
    getKontrak,
    updateKontrak,
    deleteKontrak
}