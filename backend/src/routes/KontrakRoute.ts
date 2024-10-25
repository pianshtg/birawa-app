import express from 'express'
import KontrakController from '../controllers/KontrakController'

const router = express.Router()

router.post('/', KontrakController.createKontrak)
router.get('/', KontrakController.getKontrak)
router.patch('/', KontrakController.updateKontrak)
router.delete('/', KontrakController.deleteKontrak)

export default router