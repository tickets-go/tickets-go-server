import { Request, Response, NextFunction } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";
import User from "../models/user.model";
import jwtFn from "../middleware/auth";
import validator from "validator";
import bcrypt from "bcryptjs";

const regex = /^(?=.*[a-z])(?=.*[A-Z])/;  //密碼必須包含一個大小以及一個小寫字母

const userController = {
  // register
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, passwordConfirm, birthday } = req.body;
      const emailCheck = await User.findOne({ email: email });
      if (emailCheck) {
        return handleError(res, createError(400, "Email already exists"));
      }
      if (!name || !email || !password || !passwordConfirm) {
        return handleError(res, createError(400, "Some fields are still empty."));
      }
      if (!validator.isEmail(email)) {
        return handleError(res, createError(400, "Invalid email format"));
      }
      if (!regex.test(password)) {
        return handleError(res, createError(400, "The password format is incorrect. It must contain at least one uppercase and one lowercase letter."));
      }
      if (!validator.isLength(password, { min: 8 })) {
        return handleError(res, createError(400, "Password must be at least 8 characters"));
      }
      if (password !== passwordConfirm) {
        return handleError(res, createError(400, "Passwords do not match"));
      }
      const salt = await bcrypt.genSalt(8);
      const secretPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        name : name,
        email : email,
        password: secretPassword,
        birthday : birthday,
      });

      jwtFn.jwtGenerator(newUser, res, next);
    } catch (err) {
      return next(err);
    }
  },

  // login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return handleError(res, createError(400, "Some fields are still empty."));
      }

      const user = await User.findOne({ email: email }).select("+password");
      if (!user) {
        return handleError(res, createError(400, "Account does not exist"));
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return handleError(res, createError(400, "Password is incorrect"));
      }
      jwtFn.jwtGenerator(user, res, next);
    } catch (err) {
      return next(err);
    }
  },

  // logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await User.updateOne({ _id: (req as any).user.id }, { token: "" });
      handleSuccess(res, "", "Logout successfully");
    } catch (err) {
      return next(err);
    }
  },

  // get all users
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().select("-password");
      handleSuccess(res, users, "success");
    } catch (err) {
      return next(err);
    }
  },
};

export default userController