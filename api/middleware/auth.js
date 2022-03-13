import jwt from "jsonwebtoken"
import { Users } from "../models/usersModel.js"
export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await Users.findById(decoded.id)

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      .json('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    .json('Not authorized, no token')
  }
}
