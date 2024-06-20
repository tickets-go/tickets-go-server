import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import { handleSuccess, handleError } from '../service/handleReply';
import createError from 'http-errors';
import User from '../models/user.model';
import jwtFn from '../middleware/auth';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const regex = /^(?=.*[a-z])(?=.*[A-Z])/;

interface IUser extends Document {
  _id: string; 
  name: string;
  email: string;
  password: string;
  role: string;
  token?: string;
}

const generateAccessToken = async (user: IUser) => {
  const accessToken = await jwtFn.jwtGenerator(user);

  return {
    accessToken,
    userData: {
      id: user._id.toString(), 
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const authController = {
  // register
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, passwordConfirm } = req.body;

      if (!name || !email || !password || !passwordConfirm) {
        return handleError(res, createError(400, '有欄位尚未填寫！'));
      }
      if (!validator.isEmail(email)) {
        return handleError(res, createError(400, '電子郵件格式錯誤'));
      }
      if (!regex.test(password)) {
        return handleError(res, createError(400, '密碼格式不正確，必須包含至少一個大寫字母和一個小寫字母'));
      }
      if (!validator.isLength(password, { min: 8 })) {
        return handleError(res, createError(400, '密碼至少要 8 個字元'));
      }
      if (password !== passwordConfirm) {
        return handleError(res, createError(400, '密碼不一致，請重新輸入'));
      }

      const emailCheck = await User.findOne({ email });
      if (emailCheck) {
        return handleError(res, createError(400, '電子郵件已被註冊過'));
      }

      const salt = await bcrypt.genSalt(8);
      const secretPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name, email, password: secretPassword
      });
      await newUser.save();

      const { accessToken, userData } = await generateAccessToken({
        ...newUser.toObject(),
        _id: newUser._id.toString()
      } as IUser);
      handleSuccess(res, { accessToken, user: userData });
    } catch (err) {
      return next(err);
    }
  },

  // login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return handleError(res, createError(400, '有欄位尚未填寫！'));
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return handleError(res, createError(400, '帳戶不存在，請重新輸入'));
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return handleError(res, createError(400, '密碼錯誤，請重新輸入'));
      }

      const { accessToken, userData } = await generateAccessToken({
        ...user.toObject(),
        _id: user._id.toString() 
      } as IUser);
      handleSuccess(res, { accessToken, user: userData });
    } catch (err) {
      return next(err);
    }
  },

  // logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await User.updateOne({ _id: (req as any).user.id }, { token: '' });
      handleSuccess(res, '', '登出成功');
    } catch (err) {
      return next(err);
    }
  },

  // handle Google login/register
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { displayName, emails } = req.user;
      const email = emails[0].value;

      const user = await User.findOne({ email });
      const accessToken = await jwtFn.jwtGenerator(user);

      if (!user) {
        // TODO: password 初始值要修改
        const userData = await User.create({
          name: displayName,
          email,
          password: '123' 
        });

        const data = {
          accessToken,
          userData
        };

        handleSuccess(res, data);
      } else {
        const userData = {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        };

        const data = {
          accessToken,
          userData
        };

        handleSuccess(res, data);
      }
    } catch (error) {
      return next(error);
    }
  }
};

export default authController;
