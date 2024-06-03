import { Request, Response, NextFunction } from 'express'
import User from '../models/user.model'
import jwtFn from '../middleware/auth'

const authController = {
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { displayName, emails } = req.user
      const email = emails[0].value

      const user = await User.findOne({ email: email })
      
      if (!user) {
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
  }
}
export default authController
