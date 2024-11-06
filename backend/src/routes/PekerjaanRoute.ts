import express from 'express'
import PekerjaanController from '../controllers/PekerjaanController'
import { validatePekerjaanRequest } from '../middlewares/validation'

const router = express.Router()

router.post('/', validatePekerjaanRequest, PekerjaanController.createPekerjaan)
router.get('/', PekerjaanController.getPekerjaan)
router.patch('/', PekerjaanController.updatePekerjaan)
router.delete('/', PekerjaanController.deletePekerjaan)

export default router