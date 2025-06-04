import mongoose from "mongoose";

const djSchema = new mongoose.Schema({
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
    receivedTracks: [{
        producer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producer",
        },
        trackList: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Track",
        }],
    }],
})

export const Dj = mongoose.model("Dj", djSchema)