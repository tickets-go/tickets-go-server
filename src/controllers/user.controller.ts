import { Request, Response, NextFunction } from 'express'

// import { validateSignUpData } from '../utils/validationHelpers.js'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import User from '../models/user.model'

//密碼必須包含一個大小以及一個小寫字母
const userController = {
  // get all users
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().select('-password')
      handleSuccess(res, users, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // get users
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return handleError(res, createError(401, '權限錯誤，請重新操作'));
      }

      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return handleError(res, createError(404, '使用者資料不存在'));
      }
      
      handleSuccess(res, user, 'success')
    } catch (err) {
      return next(err)
    }
  }
}

export default userController
