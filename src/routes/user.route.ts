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
router.get(
  '/',
  jwtFn.isAuth,
  handleErrorAsync(userController.getUser)
)

export default router
