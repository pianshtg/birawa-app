import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'
import { Pekerjaan } from "../types";

async function createPekerjaan(req: Request, res: Response) {
    try {
        // Get request parameter
        const {nama_mitra, nomor_kontrak, pekerjaan_arr} = req.body

        // Check if mitra exist.
        const [_kontrak] = await pool.execute<RowDataPacket[]>('SELECT id FROM kontrak WHERE nomor = ? AND mitra_id = (SELECT id FROM mitra WHERE nama = ?)', [nomor_kontrak, nama_mitra])
        if (_kontrak.length === 0) {
            res.status(409).json({message: "Kontrak doesn't exist"})
            return
        }

        // Insert pekerjaan into the database.
        const kontrak_id = _kontrak[0].id
            // Mapping array of pekerjaan.
        await Promise.all(
            pekerjaan_arr.map(
                async (pekerjaan: Pekerjaan) => {
            // Generate pekerjaan_id and insert it into the database.
                    const id = uuidv4()
                    await pool.execute('INSERT IGNORE INTO kontrak_ss_pekerjaan (id, kontrak_id, nama, lokasi) VALUES (?, ?, ?, ?)', [id, kontrak_id, pekerjaan.nama, pekerjaan.lokasi])
                }
            )
        )

        // Debug.
        res.status(201).json({
            message: "Pekerjaan created successfully.",
            created_pekerjaan: {
                kontrak_id,
                pekerjaan_arr
            }
        })
        return

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error creating Kontrak."})
        return
    }
}

async function getPekerjaan(req: Request, res: Response) {}

async function updatePekerjaan(req: Request, res: Response) {}

async function deletePekerjaan(req: Request, res: Response) {}

export default {
    createPekerjaan,
    getPekerjaan,
    updatePekerjaan,
    deletePekerjaan
}