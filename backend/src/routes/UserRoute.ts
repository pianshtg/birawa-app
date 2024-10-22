import express from 'express'
import UserController from '../controllers/UserController'
import { clientType, jwtCheck } from '../middlewares/auth'

const router = express.Router()

router.post('/', clientType, jwtCheck, UserController.createUser)
router.get('/', UserController.getUser)
router.patch('/', UserController.updateUser)
router.delete('/', UserController.deleteUser)

export default router