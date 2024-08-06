import express from "express";
import { seedDatabase } from "../controllers/seederController.js";

const seedDatabaseRouter = express.Router();

// Route to trigger database seeding
seedDatabaseRouter.post('/seed', seedDatabase);

export default seedDatabaseRouter;
