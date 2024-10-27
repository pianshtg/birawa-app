import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'

async function createKontrak(req: Request, res: Response) {
    try {
        const {nama_mitra, nama, nomor, tanggal, nilai, jangka_waktu} = req.body
        const [_mitra] = await pool.execute<RowDataPacket[]>('SELECT id FROM mitra WHERE nama = ?', [nama_mitra])

        // Check if mitra exist
        if (_mitra.length === 0) {
            res.status(409).json({message: "Mitra doesn't exist"})
            return
        }

        // Insert kontrak into the database.
        const id = uuidv4()
        await pool.execute('INSERT IGNORE INTO kontrak (id, mitra_id, nama, nomor, tanggal, nilai, jangka_waktu) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, _mitra[0].id, nama, nomor, tanggal, nilai, jangka_waktu])
        
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
            }
        })
        return

    } catch (error) {
        console.error(error)
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