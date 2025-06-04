import mongoose from "mongoose";

const djMessageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: [true, "From is required"],
        trim: true,
    },
    to: {
        type: String,
        required: [true, "To is required"],
        trim: true,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export const DjMessage = mongoose.model("DjMessage", djMessageSchema)