import { Router } from "express";
import homeController from "../controllers/home.Controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//100 get home events
router.get("/events",
    /* 	#swagger.tags = ['Home']
        #swagger.description = '100-查詢所有活動以及分類活動' */
    /*  #swagger.responses[200] = {
            schema: {
                "status": true,
                "message": "success",
                "data": {
                "events": [
                    {
                        "id": "66797ba5fd4c72984e20ac7b",
                        "name": "歐耶2023-24全台巡迴個人專場",
                        "description": "歐耶2023-24全台巡迴個人專場【 老師雞開 啥 玩笑 ? 】歐耶老師雞 2024持續幹瘋狂的事~~上次 老師雞開 ❤️ 玩笑.......",
                        "sessions": [
                            {
                                "location": "台北小巨蛋",
                                "startDate": "1970-01-20T20:57:07.200Z",
                                "startTime": "17:00",
                                "endTime": "19:00"
                            },
                            {
                                "location": "台北小巨蛋",
                                "startDate": "1970-01-20T20:57:07.200Z",
                                "startTime": "17:00",
                                "endTime": "19:00"
                            }
                        ],
                        "tags": ["小巨蛋","韓國團體"]
                    }
                ]
            }   
        }
    */

    handleErrorAsync(homeController.findEvents));

//101 get event tag
router.get("/eventTags",
    /* 	#swagger.tags = ['Home']
    #swagger.description = '101-查詢活動類別[未完成]' */

    handleErrorAsync(homeController.findTags));

//104 get home detail
router.get("/:eventId",
    /* 	#swagger.tags = ['Home']
        #swagger.description = '104-查詢活動詳細資訊' */
    /*  #swagger.responses[200] = { 
            schema: {
                "status": true,
                "message": "success",
                "data": {
                    "events": {
                        "id": "66797ba5fd4c72984e20ac7b",
                        "name": "歐耶2023-24全台巡迴個人專場",
                        "description": "歐耶2023-24全台巡迴個人專場【 老師雞開 啥 玩笑 ? 】歐耶老師雞 2024持續幹瘋狂的事~~上次 老師雞開 ❤️ 玩笑.......",
                        "sessions": [
                            {
                                "location": "台北小巨蛋",
                                "startDate": "1970-01-20T20:57:07.200Z",
                                "startTime": "17:00",
                                "endTime": "19:00"
                            },
                            {
                                "location": "台北小巨蛋",
                                "startDate": "1970-01-20T20:57:07.200Z",
                                "startTime": "17:00",
                                "endTime": "19:00"
                            }
                        ],
                        "tags": ["小巨蛋","韓國團體"]
                    }
                 }
            }
        }
    */

    handleErrorAsync(homeController.findEventDetail));





export default router;