import { Request, Response, NextFunction } from 'express'

// import { validateSignUpData } from '../utils/validationHelpers.js'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import User from '../models/user.model'
import jwtFn from '../middleware/auth'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const regex = /^(?=.*[a-z])(?=.*[A-Z])/;  //密碼必須包含一個大小以及一個小寫字母
const userController = {
  // register
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, passwordConfirm } = req.body

      const emailCheck = await User.findOne({ email: email })
      if (emailCheck) {
        return handleError(res, createError(400, '電子郵件已被註冊過'))
      }
      if (!name || !email || !password || !passwordConfirm) {
        return handleError(res, createError(400, '有欄位尚未填寫！'))
      }
      if (!validator.isEmail(email)) {
        return handleError(res, createError(400, '電子郵件格式錯誤'))
      }
      if (!regex.test(password)) {
        return handleError(res, createError(400, '密碼格式不正確，必須包含至少一個大寫字母和一個小寫字母'))
      }
      if (!validator.isLength(password, { min: 8 })) {
        return handleError(res, createError(400, '密碼至少要 8 個字元'))
      }
      if (password !== passwordConfirm) {
        return handleError(res, createError(400, '密碼不一致，請重新輸入'))
      }
      const salt = await bcrypt.genSalt(8)
      const secretPassword = await bcrypt.hash(password, salt)
      const newUser = await User.create({
        name: name,
        email: email,
        password: secretPassword
      })

      jwtFn.jwtGenerator(newUser, res, next)
    } catch (err) {
      return next(err)
    }
  },

  // login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return handleError(res, createError(400, '有欄位尚未填寫！'))
      }

      const user = await User.findOne({ email: email }).select('+password')
      if (!user) {
        return handleError(res, createError(400, '帳戶不存在，請重新輸入'))
      }
      const checkPassword = await bcrypt.compare(password, user.password)
      if (!checkPassword) {
        return handleError(res, createError(400, '密碼錯誤，請重新輸入'))
      }
      jwtFn.jwtGenerator(user, res, next)
    } catch (err) {
      return next(err)
    }
  },

  // logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await User.updateOne({ _id: (req as any).user.id }, { token: '' })
      handleSuccess(res, '', '登出成功')
    } catch (err) {
      return next(err)
    }
  },

  // handle Google login/register
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { displayName, emails } = req.user
      const email = emails[0].value

      const user = await User.findOne({ email: email })
      
      if (!user) {
        // TODO: password 初始值要修改
        const newUser = await User.create({
          name: displayName,
          email: email,
          password: 123
        })

        jwtFn.jwtGenerator(newUser, res, next)
      } else {
        jwtFn.jwtGenerator(user, res, next)
      }
    } catch (error) {
      return next(error)
    }
  },

  // get all users
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().select('-password')
      handleSuccess(res, users, 'success')
    } catch (err) {
      return next(err)
    }
  }
}

export default userController
