import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'

type Pekerjaan = {
    nama: string,
    lokasi: string
}

async function createPekerjaan(req: Request, res: Response) {
    try {
        const {nomor_kontrak, pekerjaanArr} = req.body
        const [_kontrak] = await pool.execute<RowDataPacket[]>('SELECT id FROM kontrak WHERE nomor = ?', [nomor_kontrak])

        // Check if mitra exist.
        if (_kontrak.length === 0) {
            res.status(409).json({message: "Kontrak doesn't exist"})
            return
        }

        // Insert pekerjaan into the database.
        const id = uuidv4()
        const kontrak_id = _kontrak[0].id
        await Promise.all(
            pekerjaanArr.map(
                async (pekerjaan: Pekerjaan) => {
                    const id = uuidv4()
                    await pool.execute('INSERT IGNORE INTO kontrak_ss_pekerjaan (id, kontrak_id, nama, lokasi) VALUES (?, ?, ?, ?)', [id, kontrak_id, pekerjaan.nama, pekerjaan.lokasi])
                }
            )
        )

        // Debug.
        res.status(200).json({
            message: "Pekerjaan created successfully.",
            created_pekerjaan: {
                id,
                kontrak_id,
                pekerjaanArr
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