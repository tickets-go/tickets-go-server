import { Router } from 'express'
import userController from '../controllers/user.controller'
import { handleErrorAsync } from '../service/handleErrorAsync'
import jwtFn from '../middleware/auth'

const router = Router()

// get users
router.get(
  '/users',

  /* 	#swagger.tags = ['Users']
      #swagger.description = '取得所有會員' */

  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
    */
  jwtFn.isAuth,
  handleErrorAsync(userController.getUsers)
),

  // get users
  router.get('/', jwtFn.isAuth, handleErrorAsync(userController.getUser)),

  // get user by id
  router.get(
    '/:id',

    /* 	#swagger.tags = ['Users']
    #swagger.description = '取得單一使用者' */

    /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "success",
    "data": {
        "_id": "663b77def93ddc265a8921eb",
        "name": "Allen",
        "email": "allen@gmail.com",
        "role": "user",
        "birthday": "2000-05-02T00:00:00.000Z"
    }
  }} */
    /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
    jwtFn.isAuth,
    handleErrorAsync(userController.getUserById)
  )

// update user by id
router.put(
  '/:id',

  /* 	#swagger.tags = ['Users']
    #swagger.description = '更新單一使用者' */
  /*	#swagger.parameters['obj'] = {
      in: 'body',
      description: '輸入使用者資料',
      required: true,
      schema: {
          "name": "andytsai",
          "email": "andytsai@gmail.com",
          "role": "user"
      }
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "使用者更新成功",
    "data": {
        "_id": "665df4294ee521674bdff424",
        "name": "andytsai",
        "email": "andytsai@gmail.com",
        "role": "user"
    }
  }}*/
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
  jwtFn.isAuth,
  handleErrorAsync(userController.updateUser)
)

// reset password
router.patch(
  '/reset-password/:id',

  /* 	#swagger.tags = ['Users']
    #swagger.description = '更新密碼' */
  /*	#swagger.parameters['obj'] = {
      in: 'body',
      description: '輸入使用者密碼',
      required: true,
      schema: {
        "password": "Aa123456",
        "passwordConfirm": "Aa123456"
      }
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "密碼重設成功",
    "data": {}
  }}*/
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
  jwtFn.isAuth,
  handleErrorAsync(userController.resetPassword)
)

// get user orders
/* 	#swagger.tags = ['Users']
      #swagger.description = '取得會員訂單狀態' */
router.get('/:userId/orders', jwtFn.isAuth, handleErrorAsync(userController.getUserOrders))

// get user tracking events
/* 	#swagger.tags = ['Users']
      #swagger.description = '取得會員追蹤活動' */
router.get('/:userId/tracking', jwtFn.isAuth, handleErrorAsync(userController.getUserTrackingEvents))

/* Admin permision */
// delete user by id (admin only)
router.delete(
  '/:id',

  /* 	#swagger.tags = ['Admin - Users']
    #swagger.description = '刪除單一使用者' */

  /* #swagger.responses[200] = { 
  schema: {
    "status": true,
    "message": "使用者刪除成功",
    "data": {
        "_id": "6671bc213eb28ffb72fea721",
        "name": "Allen",
        "email": "allen@gmail.com",
        "role": "user"
    }
  }}*/
  /*
    #swagger.security = [{
      "BearerAuth": []
    }]
  */
  jwtFn.isAdmin,
  handleErrorAsync(userController.deleteUser)
)

export default router
