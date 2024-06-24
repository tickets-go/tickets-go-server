import { Router } from "express";
import homeController from "../controllers/home.Controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//100 get home events
router.get("/events", handleErrorAsync(homeController.findEvents));
//101 get event tag
router.get("/eventTags", handleErrorAsync(homeController.findTags));
//104 get home detail
router.get("/:eventId", handleErrorAsync(homeController.findEventDetail));





export default router;