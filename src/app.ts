import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import swaggerFile from '../src/swagger-output.json'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import indexRouter from './routes/index'
import userRouter from './routes/user.route'
import authRouter from './routes/auth'

import './connections'

const app: express.Application = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!, // `!` 為非空斷言運算符．作用是告訴 TypeScript ，這個變數在運行時一定不會是 null 或 undefined
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile)
    }
  )
)

app.use('/', indexRouter)
app.use('/api/v1/auth', userRouter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile))
app.use('/auth', authRouter)

// catch 404 (NOT FOUND) and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals = {}
  res.locals.status = false
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {} // NODE_ENV in .env file

  res.status(err.status || 500)

  res.send(res.locals)
})

module.exports = app
