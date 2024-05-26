import { Router } from "express";
import userController from "../controllers/user.controller";
import { handleErrorAsync } from "../service/handleErrorAsync";
import jwtFn from "../middleware/auth";

const router = Router();

// register
router.post("/register", 

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
  handleErrorAsync(userController.signUp));

// login
router.post("/login", 

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
  handleErrorAsync(userController.login));

// logout
router.post("/logout", 

  /* 	#swagger.tags = ['Users']
    #swagger.description = '會員登出' */ 

  /*
  #swagger.security = [{
    "BearerAuth": []
  }]
  */
  jwtFn.isAuth, handleErrorAsync(userController.logout));

// get users
router.get("/users", 
  
    /* 	#swagger.tags = ['Users']
      #swagger.description = '取得所有會員' */ 
  
    /*
    #swagger.security = [{
      "BearerAuth": []
    }]
    */
jwtFn.isAuth, handleErrorAsync(userController.getUsers));

export default router;