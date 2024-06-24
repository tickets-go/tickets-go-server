import { Router } from "express";
import orderController from "../controllers/order.controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//200 select tickets count
router.get("/tickets", 
    /* 	#swagger.tags = ['Order']
    #swagger.description = '200-查詢場次剩餘票數' */

    handleErrorAsync(orderController.queryTickets));

//201 select seats
router.post("/seats", 
    /* 	#swagger.tags = ['Order']
    #swagger.description = '201-查詢場次剩餘座位' */

    handleErrorAsync(orderController.querySeats));

//202 lock seat
router.post("/lock", 
    /* 	#swagger.tags = ['Order']
    #swagger.description = '202-選擇座位(鎖定)' */
    
    handleErrorAsync(orderController.lockSeat));

//203 create order
router.post("/create", 
    /* 	#swagger.tags = ['Order']
    #swagger.description = '203-產生訂單' */
    
    handleErrorAsync(orderController.createOrder));

//205 select one order
router.get("/:orderId", 
    /* 	#swagger.tags = ['Order']
    #swagger.description = '205-查詢訂票' */
    
    handleErrorAsync(orderController.queryOrder));



export default router;