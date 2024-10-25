import express from 'express'
import PekerjaanController from '../controllers/PekerjaanController'

const router = express.Router()

router.post('/', PekerjaanController.createPekerjaan)
router.get('/', PekerjaanController.getPekerjaan)
router.patch('/', PekerjaanController.updatePekerjaan)
router.delete('/', PekerjaanController.deletePekerjaan)

export default router