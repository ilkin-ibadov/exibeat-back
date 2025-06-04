import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producer",
        required: [true, "Producer is required"],
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"],
        trim: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Categories are required"]
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export const Track = mongoose.model("Track", trackSchema)