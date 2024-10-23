import express from 'express'
import MitraController from '../controllers/MitraController'

const router = express.Router()

router.post('/', MitraController.createMitra)
router.get('/', MitraController.getMitra)
router.patch('/', MitraController.updateMitra)
router.delete('/', MitraController.deleteMitra)

export default router