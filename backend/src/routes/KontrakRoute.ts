import express from 'express'
import KontrakController from '../controllers/KontrakController'
import { validateCreateKontrakRequest, validateGetKontrakPekerjaansRequest } from '../middlewares/validation'

const router = express.Router()

router.post('/', validateCreateKontrakRequest, KontrakController.createKontrak)
router.post('/pekerjaans', validateGetKontrakPekerjaansRequest, KontrakController.getKontrakPekerjaans)
router.get('/all', KontrakController.getKontraks)

export default router