import { Router } from "express";
import eventController from "../controllers/event.controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

// create
router.post("/", handleErrorAsync(eventController.createEvent));
router.get("/events", handleErrorAsync(eventController.getEvents));
router.get("/events/:id", handleErrorAsync(eventController.findOneEvent));
router.delete("/events", handleErrorAsync(eventController.deleteEvents));



export default router;