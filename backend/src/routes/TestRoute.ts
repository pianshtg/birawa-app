import express from 'express'
import AuthenticationController from '../controllers/AuthenticationController'
import TestController from '../controllers/TestController'
import { clientType, jwtCheck } from '../middlewares/auth'

const router = express.Router()

// router.get('/', clientType, TestController.test)
router.get('/', TestController.test)

export default router