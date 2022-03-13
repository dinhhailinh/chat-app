import { Chats } from '../models/chatsModel.js'
import { Users } from '../models/usersModel.js'
import { Messages } from './../models/messagesModel.js'

const allMessage = async(req, res) => {
    try {
        const messages = await Messages.find({ chat: req.params.chatId })
          .populate("sender", "name pic email")
          .populate("chat");
        res.json(messages);
      } catch (error) {
        res.status(400).json(error.message);
      }
}

const sendMessage = async(req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }
    try {
        let message = await Messages.create(newMessage);
    
        message = await message.populate("sender", "name pic").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await Users.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });
    
        await Chats.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    
        res.json(message);
      } catch (error) {
        res.status(400).json(error.message);
      }
}

export {allMessage, sendMessage}
