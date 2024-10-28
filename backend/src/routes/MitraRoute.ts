import express from 'express'
import MitraController from '../controllers/MitraController'
import { clientType, jwtCheck } from '../middlewares/auth'

const router = express.Router()

router.post('/', clientType, jwtCheck, MitraController.createMitra)
router.get('/', MitraController.getMitra)
router.patch('/', MitraController.updateMitra)
router.delete('/', MitraController.deleteMitra)

export default router