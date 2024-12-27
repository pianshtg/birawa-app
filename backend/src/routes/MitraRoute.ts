import express from 'express'
import MitraController from '../controllers/MitraController'
import { updateMitraRequest, validateCreateMitraRequest, validateGetMitraUsersRequest } from '../middlewares/validation'

const router = express.Router()

router.post('/', validateCreateMitraRequest, MitraController.createMitra)
router.get('/', MitraController.getMitra)
router.post('/users', validateGetMitraUsersRequest, MitraController.getMitraUsers)
router.post('/kontraks', MitraController.getMitraKontraks)
router.get('/all', MitraController.getMitras)
router.patch('/', updateMitraRequest, MitraController.updateMitra)

export default router