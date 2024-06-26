import { Router } from 'express'
import authController from '../controllers/auth.controller'
import { handleErrorAsync } from '../service/handleErrorAsync'
import jwtFn from '../middleware/auth'
import passport from 'passport'

const router = Router()

router.get('/', (req, res) => res.send('Auth Route'));

// register
router.post(
  '/register',

  /* 	#swagger.tags = ['Users']
    #swagger.description = '會員註冊' */
  /*	#swagger.parameters['obj'] = {
      in: 'body',
      description: '輸入會員資料',
      required: true,
      schema: {
        "name": "User",
        "email": "User@gmail.com",
        "password": "User1234",
        "passwordConfirm": "User1234",
        "birthday": "2024-01-01"
      }
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "success": true,
    "message": "success",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDI0MTk3YjMxNzlkZTk2ZDA5OTE4MSIsIm5hbWUiOiJVc2VyMTIzIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTU2MTgxOTksImV4cCI6MTcxNjIyMjk5OX0.DGVcQFxLSR_K_ks2rSDLhFsO02P-v2c5kxbyGoTIzJE"
    }
  }} */
  handleErrorAsync(authController.signUp)
)

// login
router.post(
  '/login',

  /* 	#swagger.tags = ['Users']
    #swagger.description = '會員登入' */
  /*	#swagger.parameters['obj'] = {
      in: 'body',
      description: '輸入會員資料',
      required: true,
      schema: {
        "email": "User@gmail.com",
        "password": "User1234",
      }
  } */

  /* #swagger.responses[200] = { 
  schema: {
    "success": true,
    "message": "success",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDI0MTk3YjMxNzlkZTk2ZDA5OTE4MSIsIm5hbWUiOiJVc2VyMTIzIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTU2MTgxOTksImV4cCI6MTcxNjIyMjk5OX0.DGVcQFxLSR_K_ks2rSDLhFsO02P-v2c5kxbyGoTIzJE"
    }
  }} */
  handleErrorAsync(authController.login)
)

// logout
router.post(
  '/logout',

  /* 	#swagger.tags = ['Users']
    #swagger.description = '會員登出' */

  /*
  #swagger.security = [{
    "BearerAuth": []
  }]
  */
  jwtFn.isAuth,
  handleErrorAsync(authController.logout)
)

router.post(
  '/google',

  /*  #swagger.tags = ['Auth']
  #swagger.description = '使用 Google 第三方 進行認證' */
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })
)

router.get(
  '/google/callback',

  /*  #swagger.tags = ['Auth']
      #swagger.description = 'Google OAuth Callback處理' */

  /* #swagger.responses[200] = {
    description: 'Google認證成功，回傳 accessToken',
    schema: {
      success: true,
      message: 'success',
      data: {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDI0MTk3YjMxNzlkZTk2ZDA5OTE4MSIsIm5hbWUiOiJVc2VyMTIzIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTU2MTgxOTksImV4cCI6MTcxNjIyMjk5OX0.DGVcQFxLSR_K_ks2rSDLhFsO02P-v2c5kxbyGoTIzJE"
      }
    }
  } */
  passport.authenticate('google', { session: false }),
  handleErrorAsync(authController.googleAuth)
)

export default router
