import { Request, Response } from "express";
import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import {v4 as uuidv4} from 'uuid'
import jwt from 'jsonwebtoken'
import { Aktivitas, Cuaca, Dokumentasi, TenagaKerja } from "../types";
import { uploadImages } from "../lib/utils";

async function createLaporan(req: Request, res: Response) {
    const connection = await pool.getConnection()
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
        if (permissions.includes('manage_users')) { // don't forget to change the permissions
            // Begin transactions
            await connection.beginTransaction()
            // Get request parameter
            const {nama_mitra, nomor_kontrak, nama_pekerjaan, tanggal, shift, tenaga_kerja_arr, aktivitas_arr, cuaca_arr} = req.body
            // Get request files (images)
            const files = req.files as Express.Multer.File[]

            console.log("Request values: ", {nama_mitra, nomor_kontrak, nama_pekerjaan, tanggal, shift, tenaga_kerja_arr, aktivitas_arr, cuaca_arr}) //Debug.

            // Check if pekerjaan exists.
            const [pekerjaan] = await connection.execute<RowDataPacket[]>('SELECT kontrak_ss_pekerjaan.id FROM kontrak INNER JOIN kontrak_ss_pekerjaan ON kontrak.id = kontrak_ss_pekerjaan.kontrak_id WHERE kontrak.nomor = ? AND kontrak_ss_pekerjaan.nama = ?', [nomor_kontrak, nama_pekerjaan])
            if (pekerjaan.length === 0) {
                res.status(409).json({message: "Pekerjaan doesn't exist."})
                return
            }
            // Acquire pekerjaan id
            const kontrak_ss_pekerjaan_id = pekerjaan[0].id

            // Creating shift.
                // Check if the shift already exists.
            const [existingShift]= await connection.execute<RowDataPacket[]>('SELECT * FROM mitra INNER JOIN kontrak ON mitra.id = kontrak.mitra_id INNER JOIN kontrak_ss_pekerjaan ON kontrak.id = kontrak_ss_pekerjaan.kontrak_id INNER JOIN tenaga_kerja ON kontrak_ss_pekerjaan.id = tenaga_kerja.kontrak_ss_pekerjaan_id INNER JOIN shift ON tenaga_kerja.shift_id = shift.id INNER JOIN peran_tenaga_kerja ON tenaga_kerja.peran_tenaga_kerja_id = peran_tenaga_kerja.id WHERE mitra.nama = ? AND kontrak.nomor = ? AND kontrak_ss_pekerjaan.nama = ? AND tenaga_kerja.tanggal = ? AND shift.nama = ?', [nama_mitra, nomor_kontrak, nama_pekerjaan, tanggal, shift.nama])
            if (existingShift.length > 0) {
                res.status(409).json({message: 'Shift already exists.'})
                return
            }

            console.log("Shift to create:", shift) //Debug.
            
                // Generate shift id and insert it into the database
            const shiftId = uuidv4()
            await connection.execute('INSERT INTO shift (id, nama, waktu_mulai, waktu_berakhir, created_by) VALUES (?, ?, ?, ?, ?)', [shiftId, shift.nama, shift.waktu_mulai, shift.waktu_berakhir, creator_id])
            console.log("Shift successfully created:", shift) //Debug.
            
            // Creating tenaga_kerja.
                // Mapping array of tenaga_kerja.
            await Promise.all(
                tenaga_kerja_arr.map(async (tenaga_kerja: TenagaKerja) => {
                    console.log("Tenaga kerja to create:", tenaga_kerja) //Debug.
                // Checking if peran_tenaga_kerja exists.
                    const [peranTenagaKerja] = await connection.execute<RowDataPacket[]>('SELECT id FROM peran_tenaga_kerja WHERE nama = ?', [tenaga_kerja.peran])
                    // Initiating peran_tenaga_kerja_id.
                    let peranTenagaKerjaId;
                    if (peranTenagaKerja.length === 0) {
                    // Generate peran_tenaga_kerja_id and insert new peran_tenaga_kerja into the database if peran_tenaga_kerja doesn't exist.
                        peranTenagaKerjaId = uuidv4()
                        await connection.execute('INSERT INTO peran_tenaga_kerja (id, tipe_tenaga_kerja_id, nama, created_by) VALUES (?, (SELECT id FROM tipe_tenaga_kerja WHERE nama = ?), ?, ?)', [peranTenagaKerjaId, tenaga_kerja.tipe, tenaga_kerja.peran, creator_id])
                        console.log(`Tenaga kerja "${tenaga_kerja.peran}" berhasil dibuat.`) //Debug.
                    } else {
                    // Assign peran_tenaga_kerja_id to the existing peran_tenaga_kerja's id
                        peranTenagaKerjaId = peranTenagaKerja[0].id
                    }
                // Generate tenaga_kerja_id and insert tenaga_kerja into the database
                    const tenagaKerjaId = uuidv4()
                    await connection.execute('INSERT INTO tenaga_kerja (id, kontrak_ss_pekerjaan_id, shift_id, peran_tenaga_kerja_id, jumlah, tanggal, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)', [tenagaKerjaId, kontrak_ss_pekerjaan_id, shiftId, peranTenagaKerjaId, tenaga_kerja.jumlah, tanggal, creator_id])
                    console.log(`Tenaga kerja "${tenaga_kerja.peran}" dengan jumlah ${tenaga_kerja.jumlah} orang successfully created pada tanggal "${tanggal}}".`) //Debug.
                })
            )
            console.log("Tenaga Kerja successfully created:", tenaga_kerja_arr) //Debug.
            
    
            // Creating aktivitas.
                // Mapping array of aktivitas.
            let imagesContainer_debug: string[] = [];
            await Promise.all(
                aktivitas_arr.map(async (aktivitas: Aktivitas, index_aktivitas: number) => {
                    console.log("Aktivitas to create:", aktivitas) //Debug.
                // Checking if tipe_aktivitas exists.
                    const [tipeAktivitas] = await connection.execute<RowDataPacket[]>('SELECT id FROM tipe_aktivitas WHERE nama = ?', [aktivitas.tipe])
                    // Initiating tipe_aktivitas_id.
                    let tipeAktivitasId
                    if (tipeAktivitas.length === 0){
                    // Generate tipe_aktivitas_id and insert new tipe_aktivitas into the database if tipe_aktivitas doesn't exist.
                        tipeAktivitasId = uuidv4()
                        await connection.execute('INSERT INTO tipe_aktivitas (id, nama, created_by) VALUES (?, ?, ?)', [tipeAktivitasId, aktivitas.tipe, creator_id])
                        console.log(`Tipe aktivitas "${aktivitas.tipe}" berhasil dibuat.`) //Debug.
                    } else {
                    // Assign tipe_aktivitas_id to the existing tipe_aktivitas's id.
                        tipeAktivitasId = tipeAktivitas[0].id
                    }
                
                // Generate aktivitas_id and insert aktivitas into the database.
                    const aktivitasId = uuidv4()
                    await connection.execute('INSERT INTO aktivitas (id, kontrak_ss_pekerjaan_id, tipe_aktivitas_id, nama, tanggal, created_by) VALUES (?, ?, ?, ?, ?, ?)', [aktivitasId, kontrak_ss_pekerjaan_id, tipeAktivitasId, aktivitas.nama, tanggal, creator_id])
                    console.log(`Aktivitas "${aktivitas.nama}" berhasil dibuat pada pekerjaan "${nama_pekerjaan}" pada tanggal ${tanggal}`) //Debug.

                // Creating documentation
                    // Get images (2) for each activity
                const activityImageFiles = files.slice(index_aktivitas * 2, (index_aktivitas * 2) + 2)
                    // Upload both images and get the URLs
                const uploadedImageUrls = await uploadImages(activityImageFiles, nama_mitra, nomor_kontrak, nama_pekerjaan, aktivitas.nama, tanggal)
                for (const url of uploadedImageUrls) {imagesContainer_debug.push(url)} // Debug.
                // Loop through the uploaded images
                await Promise.all(
                    uploadedImageUrls.map(async (imageUrl: string, index_dokumentasi: number) => {
                    // Generate dokumentasi_id and insert dokumentasi into the database
                        const dokumentasiId = uuidv4()
                        const deskripsiDokumentasi = aktivitas.dokumentasi[index_dokumentasi].deskripsi
                        await connection.execute('INSERT INTO dokumentasi (id, aktivitas_id, link, deskripsi, created_by) VALUES (?, ?, ?, ?, ?)', [dokumentasiId, aktivitasId, imageUrl, deskripsiDokumentasi, creator_id])
                        console.log(`Dokumentasi aktivitas "${aktivitas.tipe}" dengan link "${imageUrl}" dan deskripsi "${deskripsiDokumentasi}" berhasil dibuat.`) //Debug.
                    })
                )
                console.log("Dokumentasi successfully created:", uploadedImageUrls, aktivitas.dokumentasi) //Debug.
                })
            )
            console.log("Aktivitas successfully created:", aktivitas_arr) //Debug.
    
            // Creating cuaca.
                // Mapping array of cuaca.
            await Promise.all(
                cuaca_arr.map(async (cuaca: Cuaca) => {
                    console.log("Cuaca to create:", cuaca) //Debug.
                // Checking if tipe_cuaca exists.
                    const [tipeCuaca] = await connection.execute<RowDataPacket[]>('SELECT id FROM tipe_cuaca WHERE nama = ?', [cuaca.tipe])
                    if (tipeCuaca.length === 0) {
                    // Throw error if tipe_cuaca doesn't exists in the database.
                        throw new Error ("Error searching for tipe cuaca.")
                    }
                // Checking if tipe_cuaca is 'cerah'
                    let waktu_mulai: string = "";
                    let waktu_berakhir: string = "";
                    if (cuaca.tipe == 'cerah') {
                        switch (cuaca.waktu) {
                            case 'pagi':
                                waktu_mulai = '06:00:01'
                                waktu_berakhir = '11:00:00'
                                break
                            case 'siang':
                                waktu_mulai = '11:00:01'
                                waktu_berakhir = '15:00:00'
                                break
                            case 'sore':
                                waktu_mulai = '15:00:01'
                                waktu_berakhir = '18:00:00'
                                break
                            case 'malam':
                                waktu_mulai = '18:00:01'
                                waktu_berakhir = '06:00:00'
                                break
                            default:
                                waktu_mulai = cuaca.waktu_mulai
                                waktu_berakhir = cuaca.waktu_berakhir
                        }
                    }
                // Generate cuaca_id and insert it into the database if tipe_cuaca exists.
                    const cuacaId = uuidv4()
                    await connection.execute('INSERT INTO cuaca (id, kontrak_ss_pekerjaan_id, tipe_cuaca_id, waktu, waktu_mulai, waktu_berakhir, tanggal, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [cuacaId, kontrak_ss_pekerjaan_id, tipeCuaca[0].id, cuaca.waktu, waktu_mulai, waktu_berakhir, tanggal, creator_id])
                    console.log(`Cuaca "${cuaca.tipe}" berhasil dibuat untuk tanggal ${tanggal}`) //Debug.
                })
            )
            console.log("Cuaca successfully created:", cuaca_arr) //Debug.
            
            // Commit all the queries
            await connection.commit()
    
            res.status(201).json({
                message: "Laporan created successfully.",
                created_shift: shift,
                created_tenaga_kerja: tenaga_kerja_arr,
                created_aktivitas: aktivitas_arr,
                uploaded_images: imagesContainer_debug,
                created_cuaca: cuaca_arr,
                newAccessToken
            })
            return
        } else {
        // User doesn't have the permissions.
            res.status(401).json({message: "Unauthorised."})
            return
        }
    } catch (error) {
        // Rollback the connection if there's error.
        await connection.rollback()
        console.error("Failed to start transaction.\nError:", error) // Debug.
        res.status(500).json({message: "Error creating Laporan."})
        return
        
    } finally {
        // Release the connection.
        connection.release()
    }
}

async function getLaporan(req: Request, res: Response) {}

async function updateLaporan(req: Request, res: Response) {}

async function deleteLaporan(req: Request, res: Response) {}

export default {
    createLaporan,
    getLaporan,
    updateLaporan,
    deleteLaporan
}