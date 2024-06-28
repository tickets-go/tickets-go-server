import { Router } from 'express'
import eventController from '../controllers/event.controller'
import { handleErrorAsync } from '../service/handleErrorAsync'
import jwtFn from '../middleware/auth'

const router = Router()

// 取得會員追蹤的活動狀態
/* 	#swagger.tags = ['Follow']
    #swagger.description = '取得使用者追蹤的活動' */
/*  #swagger.security = [{
    "BearerAuth": []
  }]
*/
/*  #swagger.parameters['status'] = {
      in: 'query',
      description: '訂單狀態: processing(進行中)、finished(已結束)、unstarted 未開始',
      required: true,
      schema: {
        type: 'string'
      }
    } */
/*  #swagger.responses[400] = {
      description: '錯誤的參數',
      schema: {
        status: false,
        message: '請輸入正確的參數'
      }
    } */
/*  #swagger.responses[200] = {
      description: '成功取得追蹤的活動狀態',
      schema: {
        status: 'success',
        data: [
          {
            id: follow_id, // 追蹤活動的唯一值
            eventId: {
              id: 'event_id', // 活動的唯一值
              eventName: 'event_name', // 活動名稱
              eventContent: 'event_content', // 活動內容
              tags: ['tag1', 'tag2'], // 活動標籤
              introImage: 'image_url', // 活動介紹圖片
              bannerImage: 'image_url' // 活動Banner圖片
              eventStartDate: 'start_date', // 活動開始日期
              eventEndDate: 'end_date', // 活動結束日期
            }
          }
        ]
      }
    } */
/*  #swagger.responses[200] = {
      description: '無追蹤的活動',
      schema: {
        status: true,
        message: 'success',
        data: []
      }
    } */
router.get('/follow', jwtFn.isAuth, handleErrorAsync(eventController.getFollowedEvents))

// 追蹤活動
/* 	#swagger.tags = ['Follow']
    #swagger.description = '追蹤活動' */
/*  #swagger.security = [{
    "BearerAuth": []
  }]
*/
/*  #swagger.parameters['eventId'] = {
      in: 'path',
      description: '活動ID',
      required: true,
      schema: {
        type: 'string'
      }
    } */
/*  #swagger.responses[200] = {
      description: '成功追蹤活動',
      schema: {
        status: 'success',
        message: '已成功追蹤活動'
      }
    } */
/*  #swagger.responses[400] = {
      description: '錯誤的參數',
      schema: {
        status: false,
        message: '請輸入正確的參數'
      }
    } */
/*  #swagger.responses[400] = {
      description: '已追蹤該活動',
      schema: {
        status: false,
        message: '已追蹤該活動'
      }
    } */
router.post('/follow/:eventId', jwtFn.isAuth, handleErrorAsync(eventController.followEvent))

// 取消追蹤活動
/* 	#swagger.tags = ['Follow']
    #swagger.description = '取消追蹤活動' */
/*  #swagger.security = [{
    "BearerAuth": []
  }]
*/
/*  #swagger.parameters['eventId'] = {
      in: 'path',
      description: '活動ID',
      required: true,
      schema: {
        type: 'string'
      }
    } */
/*  #swagger.responses[200] = {
      description: '成功取消追蹤活動',
      schema: {
        status: 'success',
        message: '已成功取消追蹤活動'
      }
    } */
/*  #swagger.responses[400] = {
      description: '錯誤的參數',
      schema: {
        status: false,
        message: '請輸入正確的參數'
      }
    } */
/*  #swagger.responses[400] = {
      description: '尚未追蹤該活動，無法取消',
      schema: {
        status: false,
        message: '尚未追蹤該活動，無法取消'
      }
    } */
router.delete('/unfollow/:eventId', jwtFn.isAuth, handleErrorAsync(eventController.unfollowEvent))

//500 get all events
router.get(
  '/events',

  /* 	#swagger.tags = ['Events']
        #swagger.description = '500-查詢所有活動' */
  /*  #swagger.responses[200] = {
           schema: {
                "status": true,
                "message": "success",
                "data": [
                    {
                        "_id": "66797ba5fd4c72984e20ac7b",
                        "eventName": "歐耶2023-24全台巡迴個人專場",
                        "eventIntro": "【台北最終四場】歐耶2024最新全台巡迴個人專場：老師雞開啥玩笑?",
                        "eventContent": "歐耶2023-24全台巡迴個人專場【 老師雞開 啥 玩笑 ? 】歐耶老師雞 2024持續幹瘋狂的事~~上次 老師雞開 ❤️ 玩笑.......",
                        "introImage": "imageUrl",
                        "bannerImage": "imageUrl",
                        "organizer": "卡米地 comedy club",
                        "eventStartDate": "1970-01-20T19:32:09.600Z",
                        "eventEndDate": "1970-01-20T20:15:21.599Z",
                        "releaseDate": "1970-01-20T19:32:09.600Z",
                        "payments": ["1","2"],
                        "tags": ["小巨蛋","韓國團體"],
                        "category": ["演唱會"],
                        "__v": 0
                    }
                ]
            }
        }*/

  handleErrorAsync(eventController.findAllEvents)
)

//501 get one event
router.get(
  '/:id',

  /* 	#swagger.tags = ['Events']
        #swagger.description = '501-查詢活動詳情' */
  /*  #swagger.responses[200] = {
           schema: {
        "status": true,
        "message": "success",
        "data": {
            "event": {
                "_id": "66797ba5fd4c72984e20ac7b",
                "eventName": "歐耶2023-24全台巡迴個人專場",
                "eventIntro": "【台北最終四場】歐耶2024最新全台巡迴個人專場：老師雞開啥玩笑?",
                "eventContent": "歐耶2023-24全台巡迴個人專場【 老師雞開 啥 玩笑 ? 】歐耶老師雞 2024持續幹瘋狂的事~~上次 老師雞開 ❤️ 玩笑.......",
                "introImage": "imageUrl",
                "bannerImage": "imageUrl",
                "organizer": "卡米地 comedy club",
                "eventStartDate": "1970-01-20T19:32:09.600Z",
                "eventEndDate": "1970-01-20T20:15:21.599Z",
                "releaseDate": "1970-01-20T19:32:09.600Z",
                "payments": ["1","2"],
                "tags": ["小巨蛋","韓國團體"],
                "category": ["演唱會"],
                "__v": 0
            },
            "sessions": [
                {
                    "startDate": "1970-01-20T20:57:07.200Z",
                    "startTime": "17:00",
                    "endTime": "19:00",
                    "place": "台北小巨蛋",
                    "prices": [
                        {"area": "特A區","price": 3000},
                        {"area": "特B區","price": 2000},
                        {"area": "紅1區","price": 1000},
                        {"area": "紅2區","price": 500},
                        {"area": "綠1區","price": 1000},
                        {"area": "綠2區","price": 500}
                    ]
                },
                {
                    "startDate": "1970-01-20T20:57:07.200Z",
                    "startTime": "17:00",
                    "endTime": "19:00",
                    "place": "台北小巨蛋",
                    "prices": [
                        {"area": "特A區","price": 3000},
                        {"area": "特B區","price": 2000},
                        {"area": "紅1區","price": 1000},
                        {"area": "紅2區","price": 500},
                        {"area": "綠1區","price": 1000},
                        {"area": "綠2區","price": 500}
                    ]
                }
            ]
        }
    }
        }*/

  handleErrorAsync(eventController.findOneEvent)
)

//502 create event
router.post(
  '/',

  /* 	#swagger.tags = ['Events']
        #swagger.description = '502-新增活動' */
  /*	#swagger.parameters['obj'] = {
              in: 'body',
              description: '會同時新增event、session、ticket',
              required: true,
              schema: {
                "name": "歐耶2023-24全台巡迴個人專場",
                "intro": "【台北最終四場】歐耶2024最新全台巡迴個人專場：老師雞開啥玩笑?",
                "content": "歐耶2023-24全台巡迴個人專場【 老師雞開 啥 玩笑 ? 】歐耶老師雞 2024持續幹瘋狂的事~~上次 老師雞開 ❤️ 玩笑.......",
                "introImage": "imageUrl",
                "bannerImage": "imageUrl",
                "organizer": "卡米地 comedy club",
                "eventRange": {"startDate": 1711929600,"endDate": 1714521599},
                "releaseDate":"1711929600",
                "payments": [1, 2],
                "tags": ["小巨蛋", "韓國團體"],
                "category": "演唱會",
                "sessions": [
                    {
                        "date": 1717027200,
                        "timeRange": {"startTime": "17:00","endTime": "19:00"},
                        "place": "台北小巨蛋"
                    },
                    {
                        "date": 1717027200,
                        "timeRange": {"startTime": "17:00","endTime": "19:00"},
                        "place": "台北小巨蛋"
                    }
                ],
                "prices": [
                    {"area": "特A區","price": 3000},
                    {"area": "特B區","price": 2000},
                    {"area": "紅1區","price": 1000},
                    {"area": "紅2區","price": 500},
                    {"area": "綠1區","price": 1000},
                    {"area": "綠2區","price": 500}
                ]
            }
        } 
        */

  /* #swagger.responses[200] = { 
       schema: {
            "status": true,
            "message": "success",
            "data": {
                "eventName": "歐耶2023-24全台巡迴個人專場",
                "eventIntro": "【台北最終四場】歐耶2024最新全台巡迴個人專場：老師雞開啥玩笑?",
                "eventContent": "歐耶2023-24全台巡迴個人專場【 老師雞開 啥 玩笑 ? 】歐耶老師雞 2024持續幹瘋狂的事~~上次 老師雞開 ❤️ 玩笑.......",
                "introImage": "imageUrl",
                "bannerImage": "imageUrl",
                "organizer": "卡米地 comedy club",
                "eventStartDate": "1970-01-20T19:32:09.600Z",
                "eventEndDate": "1970-01-20T20:15:21.599Z",
                "releaseDate": "1970-01-20T19:32:09.600Z",
                "payments": ["1","2"],
                "tags": ["小巨蛋","韓國團體"],
                "category": ["演唱會"],
                "_id": "66797ba5fd4c72984e20ac7b",
                "createdAt": "2024-06-24T13:59:01.402Z",
                "updateAt": "2024-06-24T13:59:01.402Z",
                "__v": 0
            }
        }
    }
*/
  handleErrorAsync(eventController.createEvent)
)

//503 update event
router.patch(
  '/:id',

  /* 	#swagger.tags = ['Events']
        #swagger.description = '503-修改活動[未完成]' */

  handleErrorAsync(eventController.updateEvent)
)

//504 delete event
router.delete(
  '/events',

  /* 	#swagger.tags = ['Events']
        #swagger.description = '504-刪除活動' */
  /*	#swagger.parameters['obj'] = {"eventId":[""]}} */

  handleErrorAsync(eventController.deleteEvent)
)

//new 手動新增場地
router.post(
  '/place',

  /* 	#swagger.tags = ['Events']
        #swagger.description = 'new-手動新增場地' */
  /*	#swagger.parameters['obj'] = {
          in: 'body',
          description: '目前寫死在程式裡',
          required: true,
          schema: {}
      } 
    */

  /* #swagger.responses[200] = { 
      schema: {
            "status": true,
            "message": "success",
            "data": {
                "placeName": "台北小巨蛋",
                "area": [
                    {"areaName": "特A區","areaRow": 1,"areaNumber": 2,"_id": "667978ef55808f889c2135cd"},
                    {"areaName": "特B區","areaRow": 1,"areaNumber": 2,"_id": "667978ef55808f889c2135ce"},
                    {"areaName": "紅1區","areaRow": 2,"areaNumber": 3,"_id": "667978ef55808f889c2135cf"},
                    {"areaName": "紅2區","areaRow": 2,"areaNumber": 3,"_id": "667978ef55808f889c2135d0"},
                    {"areaName": "綠1區","areaRow": 2,"areaNumber": 3,"_id": "667978ef55808f889c2135d1"},
                    {"areaName": "綠2區","areaRow": 2,"areaNumber": 3,"_id": "667978ef55808f889c2135d2"}
                ],
                "_id": "667978ef55808f889c2135cc",
                "createdAt": "2024-06-24T13:47:27.505Z",
                "updateAt": "2024-06-24T13:47:27.505Z",
                "__v": 0
            }
        }
    }
    */

  handleErrorAsync(eventController.createPlace)
)
export default router
