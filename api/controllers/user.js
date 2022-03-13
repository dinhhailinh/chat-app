import bcryptjs from "bcryptjs"
import { generateToken } from "../middleware/generateToken.js"
import { Users } from "../models/usersModel.js"

const register = async(req, res) => {
    const {email, username, password, pic} = req.body
    try {
        const userExists = await Users.findOne({ email });

        if (userExists) {
          res.status(400).json("User already exists")
        }else{
            const hashPass = await bcryptjs.hash(password, 12)
        
            const user = await Users.create({
                username,
                email,
                password: hashPass,
                pic
            }) 
            res.status(200).json({
                _id:user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id)
            })
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const login = async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await Users.findOne({email})
    const checkPass = bcryptjs.compare(password, user.password)
    if(user&&checkPass){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }  else{
        res.status(401).json('Invalid email or password')
    }
    } catch (error) {
        res.status(401).json(error)
    }
    
}

const getAllUser = async(req, res) => {
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
    try {
        const users = await Users.find(keyword)
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(401).json(error)
    }
  
}

const getOneUser = async(req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        const{password, ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(401).json(error)
    }
}

const updateUser = async(req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.user.id,{
            $set:req.body
        }, {new: true})
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
}

export {register, login, getAllUser, getOneUser, updateUser}