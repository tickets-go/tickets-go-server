import { Router } from 'express'
import multer from 'multer';
import imageController from '../controllers/image.controller'
import { handleErrorAsync } from '../service/handleErrorAsync'
import jwtFn from '../middleware/auth'


const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10MB
  }
})

// event image upload
router.post('/upload/event/:eventId', 

  /* 	#swagger.tags = ['Firebase Images']
    #swagger.description = '活動圖片上傳' */
  /*	#swagger.parameters['obj'] = {
      in: 'formData',
      description: '上傳圖片',
      required: true,
      type: 'file',
      name: 'file'
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "success": true,
    "message": "上傳圖片成功",
    "data": {
      "imgUrl": "https://storage.googleapis.com/tickets-go-528dd.appspot.com/events/e123123/PXL_20240216_164139284.MP.jpg?GoogleAccessId=firebase-adminsdk-5dmdo%40tickets-go-528dd.iam.gserviceaccount.com&Expires=16730294400&Signature=LCPQQpuD7mGCzb1yduVXG3wO%2FQ3zz%2F2U6NulE3AFtAQqQCkhla5TFmn3Zgy9Oj8RpHz0JE7vllhYyQNGgth5oUReUWYjHshC5u3%2FlFwIm9i2il4eWgZtAAmd8fhBNW14NJ%2B1cFyD2iVOkgLXNDRQZs9QgMj0ph4FaWaN9IE3UEr7sAn7ReCTElUCaixRjivKwE6w5lAk1Jzr3fX7yQs5psSnIPrQ7BzAYn8ktUamqW4vXlqXoccbsb1ZlgAX934vMeFhJ%2F87%2BtXRnrYaH0OgChnoBkPfmCYTlhvq0HMwjGXZRcyl5f5U3PZEhrnYX%2Fm886qALurJ6S5p%2BX2eZcC8Vw%3D%3D"
    }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
  jwtFn.isAuth, upload.single('file'), handleErrorAsync(imageController.eventImageUpload))

// user image upload
router.post('/upload/user/:userId', 

  /* 	#swagger.tags = ['Firebase Images']
    #swagger.description = '使用者圖片上傳' */
  /*	#swagger.parameters['obj'] = {
      in: 'formData',
      description: '上傳圖片',
      required: true,
      type: 'file',
      name: 'file'
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "success": true,
    "message": "上傳圖片成功",
    "data": {
      "imgUrl": "https://storage.googleapis.com/tickets-go-528dd.appspot.com/events/e123123/PXL_20240216_164139284.MP.jpg?GoogleAccessId=firebase-adminsdk-5dmdo%40tickets-go-528dd.iam.gserviceaccount.com&Expires=16730294400&Signature=LCPQQpuD7mGCzb1yduVXG3wO%2FQ3zz%2F2U6NulE3AFtAQqQCkhla5TFmn3Zgy9Oj8RpHz0JE7vllhYyQNGgth5oUReUWYjHshC5u3%2FlFwIm9i2il4eWgZtAAmd8fhBNW14NJ%2B1cFyD2iVOkgLXNDRQZs9QgMj0ph4FaWaN9IE3UEr7sAn7ReCTElUCaixRjivKwE6w5lAk1Jzr3fX7yQs5psSnIPrQ7BzAYn8ktUamqW4vXlqXoccbsb1ZlgAX934vMeFhJ%2F87%2BtXRnrYaH0OgChnoBkPfmCYTlhvq0HMwjGXZRcyl5f5U3PZEhrnYX%2Fm886qALurJ6S5p%2BX2eZcC8Vw%3D%3D"
    }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, upload.single('file'), handleErrorAsync(imageController.userImageUpload))

// get all image urls from firebase by path of eventId
router.get('/url/event/:eventId', 

  /* 	#swagger.tags = ['Firebase Images']
    #swagger.description = '取得活動的所有圖片' */

  /* #swagger.responses[200] = { 
  schema: {
    "success": true,
    "message": "取得圖片網址成功",
    "data": {
        "eventId": "e000001",
        "imgUrls": [
            "https://storage.googleapis.com/tickets-go-528dd.appspot.com/events/e123123/%E5%B0%8F%E6%96%B0.jpeg?GoogleAccessId=firebase-adminsdk-5dmdo%40tickets-go-528dd.iam.gserviceaccount.com&Expires=16730294400&Signature=icYLgMOZrTJFTyP%2BvOaJP3F1Ue2Pz3fU9iZZlijGc4jFwqNeMd4ksx9dxohYEempx10DGnmKQHCPeaMyXgeGpUrisrgf45FA0WxSUbnBcBbmVv2ibVHMoDBwR%2FoTv0Wwu26fYH8w4OqwCsbwvJOICuVHd2rltv%2BuM0smyXbmrUKX7NOiDngT7r0QNS9MytU76wROZwBM6aNeFO5LsCylyyG%2BLmmB49qSs2PJ3eJl5mS4jeQeEX1zyXZNsJUP9o6FfZ2M5KrxByfndyjhAn6PHFkfTOuLjKOt%2FhGccRhqn1rwPXSI6ZLulZ230ODcE%2FpKGr6NQ543ZXiMp9r%2BkMRycQ%3D%3D",
            "https://storage.googleapis.com/tickets-go-528dd.appspot.com/events/e123123/%E6%94%9D%E5%BD%B1%E5%B8%AB%E7%B8%BD%E8%A6%BDBanner.jpeg?GoogleAccessId=firebase-adminsdk-5dmdo%40tickets-go-528dd.iam.gserviceaccount.com&Expires=16730294400&Signature=IEPXLEbs24JCYzM%2F3WrpkEkaY8OONKpDiAthNB6J6wkpYEeRACH89uA%2F%2B5OevH7qurrw61mve7RGF2HaCK8QaEymTcO150%2FC5Ef1mNZHAZougmK4KB3eZ4Dn%2FH3IcYsL4X%2BJfh73jh3UPgqc5DPCAj%2BKKPp9IiD%2BDB3MURXdc0q6TVUMGKwJDlOy5Jm1hksdKc8Q%2B1FDRU4b2kCtEfNQ%2Fb%2BU7ZNa2o6Ym6XJVsoyQMlO4RTlDNRFLCmh9wrHerDhz28RRTd8sAxdgEFJyZHXw0jUYSaMp%2FB9624CjovPhaWxv%2FfYsMfqQjo3jFVqnGG%2BWC2EcKB5KI1B3MPP0Dd2AQ%3D%3D"
        ]
    }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(imageController.getAllImageUrlsByEventId));

// get all image urls from firebase by path of userId
router.get('/url/user/:userId', 

  /* 	#swagger.tags = ['Firebase Images']
    #swagger.description = '取得使用者的圖片' */

  /* #swagger.responses[200] = { 
  schema: {
    "success": true,
    "message": "取得圖片網址成功",
    "data": {
        "userId": "u000001",
        "imgUrls": [
            "https://storage.googleapis.com/tickets-go-528dd.appspot.com/users/u123123/%E5%B0%8F%E6%96%B0.jpeg?GoogleAccessId=firebase-adminsdk-5dmdo%40tickets-go-528dd.iam.gserviceaccount.com&Expires=16730294400&Signature=CdjhyTUogXHlqCGgqSYHuGiYR4NSUl1FLxMwREv8VLD4a51BO77npgCJS0im3X2RJ%2FRneZavC7gSr9E4NummM1F064eDf2cR9YlBmjBbArjkMQ9miKf2hDKHuYc5TRf%2FESt4ZKxJg7H0D184%2BtkG1cwuDG1yzMyFFa99kz9w%2BhddNkpPFpC8bMWwzKAfbcP0PFefwS5rqGwUftUSp7%2FC5zekkEx60Gi8m3TJFfxTcKrlLIeBBNIFmFsh2%2FXSKEY08F3skvheqYBrfyFF%2BAi7c029x72cmus11cp2%2F%2BPn3bkDJzlKTPYxvmn35qZ0N4t8r3Ex9uzqmR0axU9b3bRl2A%3D%3D"
        ]
    }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(imageController.getAllImageUrlsByUserId));

// image delete
router.delete('/delete', 

  /* 	#swagger.tags = ['Firebase Images']
    #swagger.description = '透過圖片 URL 刪除在 Firebase Storage 圖片' */
  /*	#swagger.parameters['obj'] = {
      in: 'body',
      description: '圖片網址',
      required: true,
      schema: {
        "imgUrl": "https://storage.googleapis.com/tickets-go-528dd.appspot.com/events/e123123/PXL_20240216_164139284.MP.jpg?GoogleAccessId=firebase-adminsdk-5dmdo%40tickets-go-528dd.iam.gserviceaccount.com&Expires=16730294400&Signature=LCPQQpuD7mGCzb1yduVXG3wO%2FQ3zz%2F2U6NulE3AFtAQqQCkhla5TFmn3Zgy9Oj8RpHz0JE7vllhYyQNGgth5oUReUWYjHshC5u3%2FlFwIm9i2il4eWgZtAAmd8fhBNW14NJ%2B1cFyD2iVOkgLXNDRQZs9QgMj0ph4FaWaN9IE3UEr7sAn7ReCTElUCaixRjivKwE6w5lAk1Jzr3fX7yQs5psSnIPrQ7BzAYn8ktUamqW4vXlqXoccbsb1ZlgAX934vMeFhJ%2F87%2BtXRnrYaH0OgChnoBkPfmCYTlhvq0HMwjGXZRcyl5f5U3PZEhrnYX%2Fm886qALurJ6S5p%2BX2eZcC8Vw%3D%3D"
      }
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "success": true,
    "message": "刪除圖片成功",
    "data": {}
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(imageController.imageDelete))

export default router
