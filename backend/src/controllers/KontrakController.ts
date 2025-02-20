import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'
import jwt from 'jsonwebtoken'
import { Pekerjaan } from "../types";
import { logger } from "../lib/utils";

async function createKontrak(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        const newAccessToken = req.newAccessToken
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        const permissions = metaData.permissions
        const creator_id = metaData.user_id

        // Check the user permission
        if (permissions.includes('create_kontrak')) {
        
            // Get request parameter.
            const {nama_mitra, nama, nomor, tanggal, nilai, jangka_waktu, pekerjaan_arr} = req.body

            // Check if mitra exists.
            const [mitra] = await pool.execute<RowDataPacket[]>('SELECT id FROM mitra WHERE nama = ?', [nama_mitra])
            if (mitra.length === 0) {
                res.status(409).json({message: "Mitra doesn't exist"})
                return
            }
            
            // CHeck if kontrak with same number exists.
            const [kontrak] = await pool.execute<RowDataPacket[]>('SELECT kontrak.id FROM kontrak INNER JOIN mitra ON kontrak.mitra_id = mitra.id WHERE kontrak.nomor = ?', [nomor])
            if (kontrak.length > 0) {
                res.status(409).json({message: "Kontrak with the same number already exists."})
                return
            }
            
            // Insert kontrak into the database.
            const kontrakId = uuidv4()
            await pool.execute('INSERT INTO kontrak (id, mitra_id, nama, nomor, tanggal, nilai, jangka_waktu, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [kontrakId, mitra[0].id, nama, nomor, tanggal, nilai, jangka_waktu, creator_id])
            
            await Promise.all(
                pekerjaan_arr.map(async (pekerjaan: Pekerjaan) => {
                // Generate pekerjaan_id and insert it into the database.
                    const pekerjaanId = uuidv4()
                    await pool.execute('INSERT INTO kontrak_ss_pekerjaan (id, kontrak_id, nama, lokasi, created_by) VALUES (?, ?, ?, ?, ?)', [pekerjaanId, kontrakId, pekerjaan.nama, pekerjaan.lokasi, creator_id])
                })
            )
            
            await logger({
                rekaman_id: kontrakId,
                user_id: creator_id,
                nama_tabel: 'kontrak',
                perubahan: {nama_mitra, nama, nomor, tanggal, nilai, jangka_waktu, pekerjaan_arr},
                aksi: 'insert' 
            })
            
            res.status(201).json({
                message: "Kontrak created successfully.",
                newAccessToken
            })
            return
        } else {
            // User doesn't have the permission.
            res.status(401).json({message: "Unauthorized."})
            return
        }
        
    } catch (error) {
        res.status(500).json({message: "Error creating Kontrak."})
        return
    }
}

async function getKontrakPekerjaans(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        const newAccessToken = req.newAccessToken
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        const permissions = metaData.permissions
        
        if (permissions.includes('get_kontrak_pekerjaans')) {
            const nama_mitra = metaData.nama_mitra || req.body.nama_mitra
            
            if (!nama_mitra) {
                res.status(400).json({message: "Nama mitra is required."})
                return
            } else if (metaData.nama_mitra && req.body.nama_mitra && metaData.nama_mitra != req.body.nama_mitra) {
                res.status(401).json({message: "Unauthorized."})
                return
            }
            
            const {nomor_kontrak} = req.body
            
            const [existingKontrak] = await pool.execute<RowDataPacket[]>('SELECT id FROM kontrak WHERE mitra_id = (SELECT id FROM mitra WHERE nama = ?) AND nomor = ?', [nama_mitra, nomor_kontrak])
            if (existingKontrak.length === 0) {
                res.status(409).json({message: "Failed to find kontrak."})
                return
            }
            
            const [existingKontrakPekerjaans] = await pool.execute<RowDataPacket[]>('SELECT nama, lokasi FROM kontrak_ss_pekerjaan WHERE kontrak_id = ?', [existingKontrak[0].id])
            if (existingKontrakPekerjaans.length === 0) {
                res.status(409).json({message: "Failed to find pekerjaan."})
                return
            }
            
            res.status(200).json({
                message: "Successfully retrieved kontrak's pekerjaan(s).",
                kontrak_pekerjaans: existingKontrakPekerjaans,
                newAccessToken
            })
            return
            
        } else {
            res.status(401).json({message: "Unauthorized."})
            return
        }
        
    } catch (error) {
        res.status(500).json({message: "Error getting kontrak's pekerjaan(s)."})
        return
    }
}

async function getKontraks(req: Request, res: Response) {
    try {
        const accessToken = req.accessToken
        const newAccessToken = req.newAccessToken
        const metaData = jwt.decode(accessToken!) as jwt.JwtPayload
        const permissions = metaData.permissions

        // Check the user permission
        if (permissions.includes('view_all_kontrak')) {
            const [kontrak] = await pool.execute<RowDataPacket[]>('SELECT * FROM kontrak')
            if (kontrak.length > 0) {
                res.status(200).json({
                    message: "Successfully retrieved all kontrak.",
                    kontrak,
                    newAccessToken
                })
                return
            }
        } else {
            res.status(401).json({message: "Unauthorized."})
            return
        }
    } catch (error) {
        res.status(500).json({message: "Error getting kontraks."})
        return
    }
}

export default {
    createKontrak,
    getKontrakPekerjaans,
    getKontraks,
}