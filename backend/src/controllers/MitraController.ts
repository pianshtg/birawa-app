import { Request, Response } from "express"
import { pool } from "../database"
import { RowDataPacket } from "mysql2"
import {v4 as uuidv4} from 'uuid'


async function createMitra (req: Request, res: Response) {
    try {
        const {nama, nomor_telepon, alamat} = req.body
        const [mitra]= await pool.execute<RowDataPacket[]>('SELECT * FROM mitra WHERE nama = ?', [nama])
        
        if (mitra.length > 0) {
            res.status(409).json({message: 'User already exists.'})
            return
        }

        const id = uuidv4()
        await pool.execute('INSERT INTO mitra (id, nama, nomor_telepon, alamat) VALUES (?, ?, ?, ?)', [id, nama, nomor_telepon, alamat])

        res.status(200).json({
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

export default {
    createMitra,
}