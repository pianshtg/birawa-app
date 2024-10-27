import { Request, Response } from "express"
import { pool } from "../database"
import { RowDataPacket } from "mysql2"
import {v4 as uuidv4} from 'uuid'


async function createMitra (req: Request, res: Response) {
    try {
        const {nama, nomor_telepon, alamat} = req.body
        const [mitra]= await pool.execute<RowDataPacket[]>('SELECT * FROM mitra WHERE nama = ?', [nama])
        
        if (mitra.length > 0) {
            res.status(409).json({message: 'Mitra already exists.'})
            return
        }

        const id = uuidv4()
        await pool.execute('INSERT IGNORE INTO mitra (id, nama, nomor_telepon, alamat) VALUES (?, ?, ?, ?)', [id, nama, nomor_telepon, alamat])

        res.status(201).json({
            message: "Mitra created successfully.",
            created_mitra: {
                id,
                nama,
                nomor_telepon,
                alamat
            }
        })
        return

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error creating Mitra. "})
        return
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