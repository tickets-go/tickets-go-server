import { Router } from 'express'
import { handleErrorAsync } from "../service/handleErrorAsync";
import jwtFn from '../middleware/auth'

import tagController from '../controllers/tag.controller'

const router = Router();

// get all tags
router.get('/tags', 

  /* 	#swagger.tags = ['Tags']
    #swagger.description = '取得所有標籤' */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "標籤讀取成功",
    "data": [
        {
            "_id": "66766be48b7fc755779b483b",
            "tagName": "音樂會",
            "tagStatus": true
        },
        {
            "_id": "66766f29e769161549620f38",
            "tagName": "演唱會",
            "tagStatus": true
        }
    ]
  }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(tagController.getAllTags));

// get tag by id
router.get('/:id', 

  /* 	#swagger.tags = ['Tags']
    #swagger.description = '取得單一標籤' */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "success",
    "data": {
        "_id": "66766c188b7fc755779b4840",
        "tagName": "演唱會",
        "tagStatus": true
    }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(tagController.getTagById));

// create tag
router.post('/', 

  /* 	#swagger.tags = ['Tags']
    #swagger.description = '新增標籤' */
  /*	#swagger.parameters['obj'] = {
      in: 'body',
      description: '輸入標籤名稱',
      required: true,
      schema: {
          "tagName": "演唱會"
      }
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "標籤新增成功",
    "data": {
        "tagName": "演唱會",
        "tagStatus": true,
        "_id": "66766f29e769161549620f38",
        "createdAt": "2024-06-22T06:28:57.085Z",
        "updateAt": "2024-06-22T06:28:57.085Z"
    }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(tagController.createTag));

// update tag
router.put('/:id', 

  /* 	#swagger.tags = ['Tags']
    #swagger.description = '更新單一標籤' */
  /*	#swagger.parameters['obj'] = {
      in: 'body',
      description: '輸入標籤名稱',
      required: true,
      schema: {
          "tagName": "演唱會2024",
          "tagStatus": true
      }
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "標籤更新成功",
    "data": {
      "_id": "66766f29e769161549620f38",
      "tagName": "演唱會2024",
      "tagStatus": true
    }
  }}/*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(tagController.updateTag));

// delete tag
router.delete('/:id', 

  /* 	#swagger.tags = ['Tags']
    #swagger.description = '刪除單一標籤' */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "標籤刪除成功",
    "data": {
        "_id": "66766f29e769161549620f38",
        "tagName": "演唱會2024",
        "tagStatus": true
    }
  }} */
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
jwtFn.isAuth, handleErrorAsync(tagController.deleteTag));

export default router