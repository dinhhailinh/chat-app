import mongoose from "mongoose"

const messagesSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chats" },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        },
    { timestaps: true }
)

export const Messages = mongoose.model("Messages", messagesSchema)