import express from "express";
import { getAllTracks, getTrackById, addNewTrack, editTrack, deleteTrack } from "../controllers/track.controller.js";

const router = express.Router();

router.get("/", getAllTracks);
router.post("/track/:id", getTrackById);
router.post("/add", addNewTrack);
router.post("/edit/:id", editTrack);
router.delete("/delete/:id", deleteTrack);

export default router;