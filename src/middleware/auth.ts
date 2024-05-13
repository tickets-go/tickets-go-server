import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { handleSuccess, handleError, handle401Error } from "../service/handleReply";
import createError from "http-errors";
import User from "../models/user.model";

declare module "express" {
  interface Request {
    user?: any;
    token?: string;
  }
}

const jwtFn: any = {
  // generating token
  async jwtGenerator(userInfo: any, res: any, next: NextFunction) {
    if (!userInfo || !userInfo["_id"]) {
      return handleError(res, createError(400, "Invalid user information"));
    }

    try {
      await User.findByIdAndUpdate(userInfo["_id"], {token : ""}, {new : true});

      // generate a new JWT token for the user
      const jwtToken = jwt.sign(
        {
          id : userInfo["_id"].toString(),
          name: userInfo.name,
          role: userInfo.role
        }, 
        process.env.JWT_SECRET, 
        {expiresIn : process.env.JWT_DAYS}
      );
      
      // update the user's token
      await User.findByIdAndUpdate(userInfo["_id"], {token : jwtToken.toString()}, {new : true});
      handleSuccess(res, { accessToken: jwtToken }, "success");
    } catch (err) {
      console.error("Error during JWT generation or database update:", err);

      try {
        await User.findByIdAndUpdate(userInfo["_id"], {token : ""}, {new : true});
      } catch (err) {
        console.error("rror resetting the user's token after a failure:", err);
      }

      return next(err);
    }
  },

  // verify token
  async isAuth(req: Request, res: Response, next: NextFunction) {
    try {
      let token = "";
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      };
      if (!token) {
        return handle401Error(res, "Please login.");
      };
      const decodedPayload: any = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            return reject(err);
          } else {
            resolve(payload);
          }
        })
      });

      // login
      const user = await User.findOne({ "_id" : decodedPayload.id}).select("token role");
      if(!user){
          return handle401Error(res, "Please login.");
      }
      if(!user.token || user.token != token){
          return handle401Error(res, "Invalid authentication token, please login again.");
      }

      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      return next(err);
    }
  }
}

export default jwtFn;
