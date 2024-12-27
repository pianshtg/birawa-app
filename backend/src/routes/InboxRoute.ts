import express from 'express'
import InboxController from '../controllers/InboxController'
import { validateCreateInboxRequest, validateGetInboxRequest } from '../middlewares/validation'

const router = express.Router()

router.post('/', validateCreateInboxRequest, InboxController.createInbox)
router.post('/e', validateGetInboxRequest, InboxController.getInbox)
router.post('/es', InboxController.getInboxes)

export default router