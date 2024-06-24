import { Router } from "express";
import eventController from "../controllers/event.controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//500 get all event
router.get("/events", handleErrorAsync(eventController.findAllEvents));
//501 get one event
router.get("/:id", handleErrorAsync(eventController.findOneEvent));
//502 create event
router.post("/", handleErrorAsync(eventController.createEvent));
//503 update event
router.patch("/:id", handleErrorAsync(eventController.updateEvent));
//504 delete event
router.delete("/events", handleErrorAsync(eventController.deleteEvent));

//new 手動新增場地
router.post("/place", handleErrorAsync(eventController.createPlace));


export default router;