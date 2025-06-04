import mongoose from "mongoose";

const producerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: [true, "Email is already used"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must be at least 8 characters"],
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
        required: [true, "Tracks are required"]
    }],
})

export const Producer = mongoose.model("Producer", producerSchema)