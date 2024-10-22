import express from 'express'
import MitraController from '../controllers/MitraController'

const router = express.Router()

router.post('/', MitraController.createMitra)

export default router