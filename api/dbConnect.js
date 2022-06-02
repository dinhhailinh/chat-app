import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://DinhLinh:hailinh211176@cluster0.vgfvg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        console.log(`Connected to MongoDB ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}