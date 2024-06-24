import { Router } from "express";
import orderController from "../controllers/order.controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//200 select tickets count
router.get("/tickets", handleErrorAsync(orderController.queryTickets));

//201 select seats
router.post("/seats", handleErrorAsync(orderController.querySeats));

//202 lock seat
router.post("/lock", handleErrorAsync(orderController.lockSeat));

//203 create order
router.post("/create", handleErrorAsync(orderController.createOrder));

//205 select one order
router.get("/:orderId", handleErrorAsync(orderController.queryOrder));




export default router;