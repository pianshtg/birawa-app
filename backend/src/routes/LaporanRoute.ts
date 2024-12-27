import express from 'express'
import multer from 'multer'
import LaporanController from '../controllers/LaporanController'
import { validateCreateLaporanRequest, validateGetPekerjaanLaporansRequest, validateNumberOfFiles } from '../middlewares/validation'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})

router.post('/', upload.array('files'), validateCreateLaporanRequest, validateNumberOfFiles, LaporanController.createLaporan)
router.get('/all', LaporanController.getLaporans)
router.post('/laporan-pekerjaan', validateGetPekerjaanLaporansRequest, LaporanController.getPekerjaanLaporans)
router.get('/:laporanId', LaporanController.getLaporan)

export default router