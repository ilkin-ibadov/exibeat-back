import mongoose from "mongoose";

const producerMessageSchema = new mongoose.Schema({
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
    track: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
        required: [true, "Track is required"]
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export const ProducerMessage = mongoose.model("ProducerMessage", producerMessageSchema)