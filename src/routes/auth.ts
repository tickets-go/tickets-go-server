import { Router, Request, Response } from 'express'
import authController from '../controllers/auth.controller'
import { handleErrorAsync } from '../service/handleErrorAsync'

import passport from 'passport'

const router = Router()

/* GET home page. */
router.get('/', (req: Request, res: Response) => {
  res.send('index route')
})

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  handleErrorAsync(authController.googleAuth)
)

export default router
