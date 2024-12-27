import express from 'express'
import LogController from '../controllers/LogController'

const router = express.Router()

router.get('/', LogController.getLoggings)

export default router