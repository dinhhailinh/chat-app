import {Chats} from '../models/chatsModel.js'
import {Users} from '../models/usersModel.js'

const accessChat = async(req, res) => {
    const { userId } = req.body
    try {
        if(!userId) {
            res.status(400).json('UserId param not sent with request')
        } else {
            let isChat = await Chats.find({
                isGroupChat: false,
                $and: [
                  { users: { $elemMatch: { $eq: req.user.id } } },
                  { users: { $elemMatch: { $eq: userId } } },
                ],
              })
                .populate("users", "-password")
                .populate("latestMessage");
            
            isChat = await Users.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
            });
            if (isChat.length > 0) {
            res.send(isChat[0]);
            } else {
                let chatData = {
                    chatName: "sender",
                    isGroupChat: false,
                    users: [req.user.id, userId],
                }
                const createdChat = await Chats.create(chatData);
                const FullChat = await Chats.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                )
                res.status(200).json(FullChat)
            }
        }
    } catch (error) {
        console.log(error)
    }
    
}

const fetchChats = async(req, res) => {
    try {
        Chats.find({ users: { $elemMatch: { $eq: req.user.id } } })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await Users.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400).json(error.message);
      }
}

const createGroupChat = async(req, res) => {
    if (!req.body.users || !req.body.username) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    let users = JSON.parse(req.body.users)
    if (users.length < 2) {
        return res
          .status(400)
          .send("More than 2 users are required to form a group chat");
      }
    
    users.push(req.user)
    try {
        const groupChat = await Chats.create({
          chatName: req.body.username,
          users: users,
          isGroupChat: true,
          groupAdmin: req.user,
        });
    
        const fullGroupChat = await Chats.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
    
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const renameGroup = async(req, res) => {
    try {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chats.findByIdAndUpdate(
            chatId,
            {
            chatName: chatName,
            },
            {
            new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404).json("Chat Not Found");
        } else {
            res.json(updatedChat);
        }
    } catch (error) {
        res.status(404).json(error)
    }
}

const removeFromGroup = async(req, res) => {
    try {
        const { chatId, userId } = req.body;

        // check if the requester is admin

        const removed = await Chats.findByIdAndUpdate(
            chatId,
            {
            $pull: { users: userId },
            },
            {
            new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            res.status(404).json("Chat Not Found")
        } else {
            res.json(removed);
        }
    } catch (error) {
        res.status(404).json
    }
}

const addToGroup = async(req, res) => {
    try {
        const { chatId, userId } = req.body;

        // check if the requester is admin

        const added = await Chats.findByIdAndUpdate(
            chatId,
            {
            $push: { users: userId },
            },
            {
            new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            res.status(404).json("Chat Not Found");
        } else {
            res.json(added);
        }
    } catch (error) {
        res.status(404).json
    }
}

export {accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup}