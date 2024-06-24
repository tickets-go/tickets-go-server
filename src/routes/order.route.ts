import { Router } from "express";
import orderController from "../controllers/order.controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//200 select tickets count
router.get("/tickets",
    /* 	#swagger.tags = ['Order']
        #swagger.description = '200-查詢場次剩餘票數' */
    /* #swagger.responses[200] = { 
            schema:{
                "status": true,
                "message": "success",
                "data": {
                    "eventId": "66797ba5fd4c72984e20ac7b",
                    "eventName": "歐耶2023-24全台巡迴個人專場",
                    "eventContent": "歐耶2023-24全台巡迴個人專場【 老師雞開 啥 玩笑 ? 】歐耶老師雞 2024持續幹瘋狂的事~~上次 老師雞開 ❤️ 玩笑.......",
                    "eventImages": "imageUrl",
                    "sessionId": "66797ba5fd4c72984e20ac7d",
                    "sessionDate": "17:00",
                    "tickets": [
                        {"areaName": "特A區","count": 2},
                        {"areaName": "特B區","count": 2},
                        {"areaName": "紅1區","count": 6},
                        {"areaName": "紅2區","count": 6},
                        {"areaName": "綠1區","count": 4},
                        {"areaName": "綠2區","count": 6}
                    ]
                }
            } 
        } */

    handleErrorAsync(orderController.queryTickets));

//201 select seats
router.post("/seats",
    /* 	#swagger.tags = ['Order']
        #swagger.description = '201-查詢場次剩餘座位' */
    /*	#swagger.parameters['obj'] = {
        in: 'body',
        description: '新增訂單',
        required: true,
        schema: {
            "sessionId":"66797ba5fd4c72984e20ac7d",
            "areaName":"特A區"
        }
    } */

    /* #swagger.responses[200] = { 
        schema:{
            "status": true,
            "message": "success",
            "data": {
                "sessionId": "66797ba5fd4c72984e20ac7d",
                "areaName": "特A區",
                "seats": [
                    {"row": 1,"number": 1},
                    {"row": 1,"number": 2}
                ]
            }
        }
    } */

    handleErrorAsync(orderController.querySeats));

//202 lock seat
router.post("/lock",
    /* 	#swagger.tags = ['Order']
        #swagger.description = '202-選擇座位(鎖定)' */
    /*	#swagger.parameters['obj'] = {
    
            in: 'body',
            description: '新增訂單',
            required: true,
            schema: {
                "sessionId": "66797ba5fd4c72984e20ac7d",
                "areaName": "特A區",
                "seatRow": "1",
                "seatNumber": "1"
            }
        } 
    */

    /* #swagger.responses[200] = { 
        schema:{
            "status": true,
            "message": "success",
            "data": {
                "message": "更新成功",
                "sessionId": "66797ba5fd4c72984e20ac7d",
                "areaName": "特A區",
                "seatRow": "1",
                "seatNumber": "1",
                "remainSeats": [{"seatRow": 1,"seatNumber": 2}]
            }
        }
    } 
*/

    handleErrorAsync(orderController.lockSeat));

//203 create order
router.post("/create",
    /* 	#swagger.tags = ['Order']
        #swagger.description = '203-產生訂單' */
    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: '新增訂單',
            required: true,
            schema: {
                "userName":"denny@gmail.com",
                "sessionId":"66797ba5fd4c72984e20ac7d",
                "count":2,
                "areaName":"綠1區",
                "seats":[{"row":"1","number":"1"},{"row":"1","number":"2"}]
            }
        } 
    */

    /* #swagger.responses[200] = {
        schema:{
            "status": true,
            "message": "success",
            "data": {
                "ticketName": "歐耶2023-24全台巡迴個人專場",
                "areaName": "綠1區",
                "areaPrice": 1000,
                "price": 2000,
                "seats": [
                    {"seatRow": 1,"seatNumber": 1,"_id": "66797faaa190fd08d94874cb"},
                    {"seatRow": 1,"seatNumber": 2,"_id": "66797faaa190fd08d94874cc"}
                ],
                "ticketCount": 2,
                "userId": "denny@gmail.com",
                "eventId": "66797ba5fd4c72984e20ac7b",
                "sessinId": "66797ba5fd4c72984e20ac7d",
                "orderStatus": "0",
                "_id": "66797faaa190fd08d94874ca",
                "createdAt": "2024-06-24T14:16:10.898Z",
                "updateAt": "2024-06-24T14:16:10.898Z",
                "__v": 0
            }
        } 
    } 
*/

    handleErrorAsync(orderController.createOrder));

//205 select one order
router.get("/:orderId",
    /* 	#swagger.tags = ['Order']
        #swagger.description = '205-查詢訂單' */
    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: '0:訂單成立、1:付款完成、2.付款失敗',
    } */

    /* #swagger.responses[200] = {
            schema:{
                "status": true,
                "message": "success",
                "data": {
                    "orderId": "66797faaa190fd08d94874ca",
                    "status": "0"
                }
            }
        } 
    */

    handleErrorAsync(orderController.queryOrder));



export default router;