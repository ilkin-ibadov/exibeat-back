import express from "express";
import { getAllCategories, getCategoryById, addNewCategory, editCategory, deleteCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/category/:id", getCategoryById);
router.post("/add", addNewCategory);
router.post("/edit/:id", editCategory);
router.delete("/delete/:id", deleteCategory);

export default router;