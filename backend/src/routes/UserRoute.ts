import express from 'express'
import UserController from '../controllers/UserController'
import { clientType, jwtCheck } from '../middlewares/auth'
import { validateCreateUserRequest, validateDeleteUserRequest, validateUpdateUserRequest } from '../middlewares/validation'

const router = express.Router()

router.post('/', validateCreateUserRequest, UserController.createUser)
router.get('/', UserController.getUser)
router.get('/all', UserController.getUsers)
router.patch('/', validateUpdateUserRequest, UserController.updateUser)
router.post('/soft-delete', validateDeleteUserRequest, UserController.deleteUser)

export default router