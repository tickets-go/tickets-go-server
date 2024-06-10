import { Router } from "express";
import orderController from "../controllers/order.controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

router.get("/tickets", handleErrorAsync(orderController.queryTickets));
router.post("/create", handleErrorAsync(orderController.createOrder));



export default router;