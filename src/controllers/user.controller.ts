import { Request, Response, NextFunction } from 'express'

// import { validateSignUpData } from '../utils/validationHelpers.js'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import User from '../models/user.model'

import validator from 'validator';
import bcrypt from 'bcryptjs';

const regex = /^(?=.*[a-z])(?=.*[A-Z])/;

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
  },

  // get user by id
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const user = await User.findById(id).select('-password')

      if (!user) {
        return handleError(res, createError(404, '使用者不存在'))
      }
      handleSuccess(res, user, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // update user
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { name, email, role } = req.body

      // check if email is already in use
      const existUser = await User.findOne({ email })
      if (existUser && existUser._id.toString() !== id) {
        return handleError(res, createError(400, '電子郵件已被註冊過，請重新輸入'))
      }

      const updatedUser = await User.findByIdAndUpdate({ _id: id }, 
        { name, email, role }, 
        { new: true }
      ).select('-password')

      if (!updatedUser) {
        return handleError(res, createError(404, '使用者不存在'))
      }
      
      handleSuccess(res, updatedUser, '使用者更新成功')
    } catch (err) {
      return next(err)
    }
  },
  
  // delete user
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const user = await User.findByIdAndDelete(id).select('-password')

      if (!user) {
        return handleError(res, createError(404, '使用者不存在'))
      }
      
      handleSuccess(res, user, '使用者刪除成功')
    } catch (err) {
      return next(err)
    }
  },

  // reset password
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { password, passwordConfirm } = req.body

      if (!password || !passwordConfirm) {
        return handleError(res, createError(400, '請輸入密碼'))
      }
      if (password !== passwordConfirm) {
        return handleError(res, createError(400, '密碼不一致，請重新輸入'));
      }
      if (!regex.test(password)) {
        return handleError(res, createError(400, '密碼格式不正確，必須包含至少一個大寫字母和一個小寫字母'));
      }
      if (!validator.isLength(password, { min: 8 })) {
        return handleError(res, createError(400, '密碼至少要 8 個字元'));
      }

      const salt = await bcrypt.genSalt(8)
      const secretPassword = await bcrypt.hash(password, salt)

      const updatedUser = await User.findByIdAndUpdate(id, 
        { password: secretPassword }, 
        { new: true }
      ).select('-password')

      if (!updatedUser) {
        return handleError(res, createError(404, '使用者不存在'))
      }
      
      handleSuccess(res, {}, '密碼重設成功')
    } catch (err) {
      return next(err)
    }
  }
}

export default userController
