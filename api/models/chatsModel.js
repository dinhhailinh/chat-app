import mongoose from "mongoose"

const chatsSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
    { timestaps: true }
)

export const Chats = mongoose.model("Chats", chatsSchema)