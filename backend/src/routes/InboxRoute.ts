import express from 'express'
import InboxController from '../controllers/InboxController'
import { clientType, jwtCheck } from '../middlewares/auth'
import { validateUserRequest } from '../middlewares/validation'

const router = express.Router()

router.post('/', InboxController.createInbox)

export default router