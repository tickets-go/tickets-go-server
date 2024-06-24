import { Router } from "express";
import homeController from "../controllers/home.Controller";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//100 get home events
router.get("/events", 
    /* 	#swagger.tags = ['Home']
    #swagger.description = '100-查詢所有活動以及分類活動' */
    
    handleErrorAsync(homeController.findEvents));

//101 get event tag
router.get("/eventTags", 
    /* 	#swagger.tags = ['Home']
    #swagger.description = '101-查詢活動類別' */
    
    handleErrorAsync(homeController.findTags));

//104 get home detail
router.get("/:eventId", 
    /* 	#swagger.tags = ['Home']
    #swagger.description = '104-查詢活動詳細資訊' */
    
    handleErrorAsync(homeController.findEventDetail));





export default router;