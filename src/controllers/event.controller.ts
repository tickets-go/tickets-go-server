import { Request, Response, NextFunction } from 'express'
import mongoose, { Document } from 'mongoose'

import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import Event from '../models/event.model'
import Session from '../models/session.model'
import Ticket from '../models/ticket.model'
import Place from '../models/place.model'
import Follow from '../models/follow.model'

// import validator from 'validator'

const eventController = {
  //502 create event
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventReq = req.body
      console.log(eventReq)

      //createEvent
      const name = eventReq.name
      const intro = eventReq.intro
      const content = eventReq.content
      const introImage = eventReq.introImage
      const bannerImage = eventReq.bannerImage
      const organizer = eventReq.organizer
      const eventRange = eventReq.eventRange //物件
      const releaseDate = eventReq.releaseDate
      const payments = eventReq.payments //陣列
      const tags = eventReq.tags //陣列
      // const category = eventReq.category
      const sessions = eventReq.sessions //陣列+物件
      const prices = eventReq.prices //陣列+物件

      const newEvent = await Event.create({
        eventName: name,
        eventIntro: intro,
        eventContent: content,
        introImage: introImage,
        bannerImage: bannerImage,
        organizer: organizer,
        eventStartDate: eventRange.startDate,
        eventEndDate: eventRange.endDate,
        releaseDate: releaseDate,
        payments: payments,
        tags: tags

        // category: category
      })

      //createSession
      console.log('sessions的長度:' + sessions.length)
      for (var i = 0; i < sessions.length; i++) {
        var session = sessions[i]
        var sessionDate = session.date
        var sessionStartTime = session.timeRange.startTime
        var sessionEndTime = session.timeRange.endTime
        var sessionPlace = session.place

        const newSession = await Session.create({
          eventId: newEvent._id,
          sessionName: name,
          sessionStartDate: sessionDate,
          sessionStartTime: sessionStartTime,
          sessionEndTime: sessionEndTime,
          sessionPlace: sessionPlace,
          sessionStatus: '0'
        })

        //createTicket
        console.log(prices.length)
        for (let j = 0; j < prices.length; j++) {
          var price = prices[j]

          var areaName = price.area

          // placeName,areaName
          var place = await Place.findOne({ placeName: sessionPlace })
          if (place == null) {
            return handleError(res, createError(400, '[' + sessionPlace + ']' + '沒有這個場地'))
          }

          var areas = place.area
          var area: any = areas.filter(e => areaName == e.areaName)
          console.log(area)
          if (area.length === 0) {
            return handleError(res, createError(400, '[' + areaName + ']' + '沒有這個區域'))
          }
          var areaRow = area[0].areaRow
          var areaNumber = area[0].areaNumber

          console.log('areaRow:' + areaRow)
          console.log('areaNumber:' + areaNumber)

          //雙層迴圈，第一層排(m)，第二層號碼(n)
          for (let m = 1; m <= areaRow; m++) {
            for (let n = 1; n <= areaNumber; n++) {
              const newTicket = await Ticket.create({
                eventId: newEvent._id,
                sessionId: newSession._id,
                areaName: areaName,
                seatRow: m, //+ "排"
                seatNumber: n, //+ "號"
                price: price.price,
                status: '0'
              })
            }
          }
        }
      }

      handleSuccess(res, newEvent, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // get all events
  async findAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      //還需要加上參數條件查詢
      console.log(req.query)
      console.log(req.query.event)
      console.log(req.query.tag)
      console.log(req.query.status)
      console.log(req.query.page)
      console.log(req.query.limit)

      const events = await Event.find()

      handleSuccess(res, events, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // delete events
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventReq = req.body
      const eventIds = eventReq.eventId

      for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i]
        await Ticket.deleteMany({ eventId: eventId })
        await Session.deleteMany({ eventId: eventId })
        await Event.findByIdAndDelete({ _id: eventId })
      }

      handleSuccess(res, eventIds, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // find one event
  async findOneEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id
      const event = await Event.findById({ _id: eventId })
      if (event == null) {
        return handleError(res, createError(400, '找不到活動'))
      }

      const sessions = await Session.find({ eventId: eventId })
      const sessionArr = []
      for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i]

        const place = await Place.findOne({ placeName: session.sessionPlace })
        if (place == null) {
          return handleError(res, createError(400, '找不到場地'))
        }
        const areas = place.area
        if (areas == null) {
          return handleError(res, createError(400, '找不到區域'))
        }

        const priceArr = []
        for (let j = 0; j < areas.length; j++) {
          const area = areas[j]

          const ticket = await Ticket.findOne({
            sessionId: session._id,
            areaName: area.areaName
          })

          if (ticket == null) {
            return handleError(res, createError(400, '找不到票價'))
          }
          priceArr.push({
            area: area.areaName,
            price: ticket.price
          })
        }

        sessionArr.push({
          sessionId: session._id,
          startDate: session.sessionStartDate,
          startTime: session.sessionStartTime,
          endTime: session.sessionEndTime,
          place: session.sessionPlace,
          prices: priceArr
        })
      }

      console.log(event)

      const result = {
        event: event,
        sessions: sessionArr
      }

      handleSuccess(res, result, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // updateEvent
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id
      const eventReq = req.body;

      const name = eventReq.name
      const intro = eventReq.intro
      const content = eventReq.content
      const introImage = eventReq.introImage
      const bannerImage = eventReq.bannerImage
      const organizer = eventReq.organizer
      const eventRange = eventReq.eventRange //物件
      const releaseDate = eventReq.releaseDate
      const payments = eventReq.payments //陣列
      const tags = eventReq.tags //陣列
      const category = eventReq.category

      const sessions = eventReq.sessions
      const prices = eventReq.prices

      //修改活動
      const event = await Event.findOneAndUpdate(
        {
          _id: eventId
        },
        {
          eventName: name,
          eventIntro: intro,
          eventContent: content,
          introImage: introImage,
          bannerImage: bannerImage,
          organizer: organizer,
          eventStartDate: eventRange.startDate,
          eventEndDate: eventRange.endDate,
          releaseDate: releaseDate,
          payments: payments,
          tags: tags,
          category: category,
          updateAt: new Date()
        }
      )

      //修改場次
      for (var i = 0; i < sessions.length; i++) {
        var session = sessions[i]
        var sessionId = session.sessionId
        var sessionDate = session.date
        var sessionStartTime = session.timeRange.startTime
        var sessionEndTime = session.timeRange.endTime
        var sessionPlace = session.place

        await Session.findByIdAndUpdate(
          {
            _id: sessionId
          },
          {
            sessionName: name,
            sessionStartDate: sessionDate,
            sessionStartTime: sessionStartTime,
            sessionEndTime: sessionEndTime,
            sessionPlace: sessionPlace,
            sessionStatus: '0',
            updateAt: new Date()
          }
        )
      }

      //修改票價
      for (var i = 0; i < prices.length; i++) {
        var priceObj = prices[i]
        var areaName = priceObj.area
        var price = priceObj.price

        await Ticket.updateMany(
          {
            eventId: eventId,
            areaName: areaName
          },
          {
            price: price,
            updateAt: new Date()
          }
        )
      }

      handleSuccess(res, eventReq, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // cratePlace //這裡寫死要產生場地資料
  async createPlace(req: Request, res: Response, next: NextFunction) {
    try {
      const newPlace = await Place.create({
        placeName: '台北小巨蛋',
        area: [
          { areaName: '特A區', areaRow: 1, areaNumber: 2 },
          { areaName: '特B區', areaRow: 1, areaNumber: 2 },
          { areaName: '紅1區', areaRow: 2, areaNumber: 3 },
          { areaName: '紅2區', areaRow: 2, areaNumber: 3 },
          { areaName: '綠1區', areaRow: 2, areaNumber: 3 },
          { areaName: '綠2區', areaRow: 2, areaNumber: 3 }
        ]
      })

      handleSuccess(res, newPlace, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // 追蹤活動
  async followEvent(req: Request, res: Response, next: NextFunction) {
    try {
      // const { userId } = req.body
      const userId = req.user
      const eventId = req.params.eventId

      // 檢查事件是否存在
      const eventExists = await Event.findById(eventId)
      if (!eventExists) {
        return handleError(res, createError(404, '找不到指定的活動'))
      }

      // 檢查使用者是否已追蹤該活動
      const existingFollow = await Follow.findOne({ userId, eventId })
      if (existingFollow) {
        return handleError(res, createError(404, '已追蹤該活動'))
      }

      // 新增新的活動追蹤紀錄
      await Follow.create({ userId, eventId })

      handleSuccess(res, '', '追蹤活動成功')
    } catch (error) {
      return next(error)
    }
  },

  // 取消追蹤活動
  async unfollowEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user
      const eventId = req.params.eventId

      // 檢查事件是否存在
      const eventExists = await Event.findById(eventId)
      if (!eventExists) {
        return handleError(res, createError(404, '找不到指定的活動'))
      }

      const result = await Follow.findOneAndDelete({ userId, eventId })
      if (!result) {
        return handleError(res, createError(404, '尚未追蹤該活動，無法取消'))
      }

      handleSuccess(res, '', '取消追蹤活動')
    } catch (error) {
      return next(error)
    }
  },

  // 取得用戶追蹤的活動
  async getFollowedEvents(req: Request, res: Response, next: NextFunction) {
    interface EventDateQuery {
      eventEndDate?: {
        $gte?: Date
        $lt?: Date
      }
      eventStartDate?: {
        $lte?: Date
        $lt?: Date
        $gt?: Date
      }
    }

    // Event interface
    interface IEvent extends Document {
      eventName: string
      eventIntro: string
      eventContent: string
      introImage: string
      bannerImage: string
      eventStartDate: Date
      eventEndDate: Date
      releaseDate: Date
      payments: string[]
      tags?: string[]
      category: string[]
      createdAt?: Date
      updateAt?: Date
    }

    // Follow interface
    interface IFollow extends Document {
      userId: mongoose.Types.ObjectId
      eventId: IEvent
    }

    try {
      const userId = req.user
      const status = req.query.status as string

      // processing 進行中; finished 已結束; unstarted 未開始
      const validStatuses = ['processing', 'finished', 'unstarted']

      // 檢查 status 參數是否存在、是否有效
      if (!status || !validStatuses.includes(status)) {
        return handleError(res, createError(400, '請輸入正確的參數'))
      }

      const match: EventDateQuery = {}
      const currentDate = new Date()

      if (status === 'processing') {
        match.eventStartDate = { $lte: currentDate }
        match.eventEndDate = { $gte: currentDate }
      } else if (status === 'unstarted') {
        match.eventStartDate = { $gt: currentDate }
      } else if (status === 'finished') {
        match.eventStartDate = { $lt: currentDate }
        match.eventEndDate = { $lt: currentDate }
      }

      const events = await Follow.find({ userId })
        .populate<IFollow>({
          path: 'eventId',
          match: match,
          select:
            '_id eventName eventIntro eventContent introImage bannerImage eventStartDate eventEndDate releaseDate tags'
        })
        .exec()

      const filteredEvents = events.filter(event => event.eventId !== null)

      const response = filteredEvents.map(event => ({
        id: event._id,
        eventId: {
          id: event.eventId._id,
          eventName: event.eventId.eventName,
          eventIntro: event.eventId.eventIntro,
          eventContent: event.eventId.eventContent,
          tags: event.eventId.tags,
          introImage: event.eventId.introImage,
          bannerImage: event.eventId.bannerImage,
          eventStartDate: event.eventId.eventStartDate,
          eventEndDate: event.eventId.eventEndDate,
          releaseDate: event.eventId.releaseDate
        }
      }))

      handleSuccess(res, response, 'success')
    } catch (error) {
      return next(error)
    }
  },

  // 關鍵字查詢
  async searchEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query

      if (!query) {
        return handleError(res, createError(400, '請輸入關鍵字'))
      }

      // 模糊搜尋
      const searchQuery = Array.isArray(query) ? query[0] : query

      if (typeof searchQuery !== 'string') {
        return handleError(res, createError(400, '格式錯誤，請重新輸入'))
      }

      const searchQueries = searchQuery.split(',').map(q => q.trim())

      // 使用 'i' 來忽略大小寫
      const searchRegexes = searchQueries.map(q => new RegExp(q, 'i'))

      // const currentDate = new Date()
      // console.log(currentDate)

      // TODO: 補上時間區間
      const events = await Event.find({
        $and: [
          { $or: [{ eventName: { $in: searchRegexes } }, { tags: { $in: searchRegexes } }] },

          // { eventStartDate: { $lte: currentDate } }, // 活動已經開始
          // { eventEndDate: { $gte: currentDate } } // 活動尚未結束
        ]
      })
        .select(
          '_id eventName eventIntro eventContent introImage bannerImage eventStartDate eventEndDate releaseDate tags'
        )
        .exec()

      const response = events.map(event => ({
        id: event._id,
        eventName: event.eventName,
        eventIntro: event.eventIntro,
        eventContent: event.eventContent,
        tags: event.tags,
        introImage: event.introImage,
        bannerImage: event.bannerImage,
        eventStartDate: event.eventStartDate,
        eventEndDate: event.eventEndDate,
        releaseDate: event.releaseDate
      }))

      handleSuccess(res, response, 'success')
    } catch (error) {
      return next(error)
    }
  }
}

export default eventController
