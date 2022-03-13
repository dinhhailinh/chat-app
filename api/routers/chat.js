import express from "express"
import { accessChat, fetchChats, addToGroup, createGroupChat, removeFromGroup, renameGroup } from "../controllers/chat.js";
import { protect } from './../middleware/auth.js';

const chatRoute = express.Router()

chatRoute.post('/', protect, accessChat)
chatRoute.get('/', protect, fetchChats)
chatRoute.post('/group', protect, createGroupChat)
chatRoute.put('/rename-group',protect, renameGroup)
chatRoute.put('/remove-group',protect, removeFromGroup)
chatRoute.put('/add-group',protect, addToGroup)
export default chatRoute