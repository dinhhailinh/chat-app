import express from "express";
import userRoute from './user.js';
import chatRoute from './chat.js';
import messageRoute from "./message.js";
const route = express.Router()

route.use('/user', userRoute)
route.use('/chat', chatRoute)
route.use('/message', messageRoute)
export default route