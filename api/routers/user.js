import express from "express";

import {register, login, getAllUser, getOneUser, updateUser} from '../controllers/user.js'
import { validatorRegister, isRequestValidated } from './../middleware/validator.js';
import { protect } from './../middleware/auth.js';
const userRoute = express.Router()

userRoute.post('/register', validatorRegister, isRequestValidated, register)
userRoute.post('/login', login)
userRoute.get('/', getAllUser)
userRoute.get('/:id', getOneUser)
userRoute.put('/update', protect, updateUser)

export default userRoute