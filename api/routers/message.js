import express from "express"
import { allMessage, sendMessage } from "../controllers/message.js"
import { protect } from './../middleware/auth.js'

const messageRoute = express.Router()

messageRoute.get('/:chatId', protect, allMessage)
messageRoute.post('/', protect, sendMessage)
export default messageRoute