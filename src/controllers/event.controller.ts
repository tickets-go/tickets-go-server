import { Request, Response, NextFunction } from 'express'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import Event from '../models/event.model'
import Session from '../models/session.model'
import Ticket from '../models/ticket.model'
import Place from '../models/place.model'
import validator from 'validator'


const eventController = {
    //502 create event
    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {

            const eventReq = req.body;
            console.log(eventReq);

            //createEvent
            const name = eventReq.name;
            const intro = eventReq.intro;
            const content = eventReq.content;
            const introImage = eventReq.introImage;
            const bannerImage = eventReq.bannerImage;
            const organizer = eventReq.organizer;
            const eventRange = eventReq.eventRange;//物件
            const releaseDate = eventReq.releaseDate;
            const payments = eventReq.payments;//陣列
            const tags = eventReq.tags;//陣列
            const category = eventReq.category;
            const sessions = eventReq.sessions;//陣列+物件
            const prices = eventReq.prices;//陣列+物件

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
                tags: tags,
                category: category,
            });


            //createSession
            console.log("sessions的長度:" + sessions.length);
            for (var i = 0; i < sessions.length; i++) {

                let session = sessions[i];
                let sessionDate = session.date;
                let sessionStartTime = session.timeRange.startTime;
                let sessionEndTime = session.timeRange.endTime;
                let sessionPlace = session.place;

                let newSession = await Session.create({
                    eventId: newEvent._id,
                    sessionName: name,
                    sessionStartDate: sessionDate,
                    sessionStartTime: sessionStartTime,
                    sessionEndTime: sessionEndTime,
                    sessionPlace: sessionPlace,
                    sessionStatus: "0"
                });

                //createTicket
                console.log(prices.length);
                for (var j = 0; j < prices.length; j++) {

                    let price = prices[j];

                    let areaName = price.area;

                    // placeName,areaName
                    let place = await Place.findOne({ placeName: sessionPlace });
                    if (place == null) {
                        return handleError(res, createError(400, '[' + sessionPlace + ']' + '沒有這個場地'))
                    }

                    let areas = place.area;
                    let area: any = areas.filter(e => areaName == e.areaName);
                    console.log(area);
                    if (area.length === 0) {
                        return handleError(res, createError(400, '[' + areaName + ']' + '沒有這個區域'))
                    }
                    var areaRow = area[0].areaRow;
                    var areaNumber = area[0].areaNumber;

                    console.log("areaRow:" + areaRow);
                    console.log("areaNumber:" + areaNumber);

                    //雙層迴圈，第一層排(m)，第二層號碼(n)
                    for (var m = 1; m <= areaRow; m++) {
                        for (var n = 1; n <= areaNumber; n++) {
                            const newTicket = await Ticket.create({
                                eventId: newEvent._id,
                                sessionId: newSession._id,
                                areaName: areaName,
                                seatRow: m, //+ "排"
                                seatNumber: n, //+ "號"
                                price: price.price,
                                status: "0"
                            });
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
            console.log(req.query);
            console.log(req.query.event);
            console.log(req.query.tag);
            console.log(req.query.status);
            console.log(req.query.page);
            console.log(req.query.limit);


            const events = await Event.find();

            handleSuccess(res, events, 'success')
        } catch (err) {
            return next(err)
        }
    },

    // delete events
    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {

            const eventReq = req.body;
            const eventIds = eventReq.eventId;

            for (var i = 0; i < eventIds.length; i++) {
                let eventId = eventIds[i];
                await Ticket.deleteMany({ eventId: eventId });
                await Session.deleteMany({ eventId: eventId });
                await Event.findByIdAndDelete({ _id: eventId });
            }

            handleSuccess(res, eventIds, 'success')
        } catch (err) {
            return next(err)
        }
    },
    // find one event
    async findOneEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = req.params.id;
            const event = await Event.findById({ _id: eventId });
            if (event == null) {
                return handleError(res, createError(400, '找不到活動'))
            }

            const sessions = await Session.find({ "eventId": eventId });
            var sessionArr = [];
            for (var i = 0; i < sessions.length; i++) {
                var session = sessions[i];

                const place = await Place.findOne({ "placeName": session.sessionPlace });
                if (place == null) {
                    return handleError(res, createError(400, '找不到場地'))
                }
                const areas = place.area;
                if (areas == null) {
                    return handleError(res, createError(400, '找不到區域'))
                }

                var priceArr = [];
                for (var j = 0; j < areas.length; j++) {
                    var area = areas[j];

                    const ticket = await Ticket.findOne({
                        "sessionId": session._id,
                        "areaName": area.areaName
                    });

                    if (ticket == null) {
                        return handleError(res, createError(400, '找不到票價'))
                    }
                    priceArr.push({
                        "area": area.areaName,
                        "price": ticket.price
                    });

                }

                sessionArr.push({
                    "startDate": session.sessionStartDate,
                    "startTime": session.sessionStartTime,
                    "endTime": session.sessionEndTime,
                    "place": session.sessionPlace,
                    "prices": priceArr
                });
            }

            console.log(event);

            var result = {
                "event": event,
                "sessions": sessionArr
            }

            handleSuccess(res, result, 'success');


        } catch (err) {
            return next(err)
        }
    },
    // updateEvent
    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {


            const eventId = req.params.id;

            //這裡還需要做資料的整理
            const eventReq = req.body;


            handleSuccess(res, eventReq, 'success');
        } catch (err) {
            return next(err)
        }
    },

    // cratePlace //這裡寫死要產生場地資料
    async createPlace(req: Request, res: Response, next: NextFunction) {
        try {
            const newPlace = await Place.create({
                placeName: "台北小巨蛋",
                area: [
                    { areaName: "特A區", areaRow: 1, areaNumber: 2 },
                    { areaName: "特B區", areaRow: 1, areaNumber: 2 },
                    { areaName: "紅1區", areaRow: 2, areaNumber: 3 },
                    { areaName: "紅2區", areaRow: 2, areaNumber: 3 },
                    { areaName: "綠1區", areaRow: 2, areaNumber: 3 },
                    { areaName: "綠2區", areaRow: 2, areaNumber: 3 },
                ],
                // createdAt: Date.now,
                // updateAt: Date.now
            });

            handleSuccess(res, newPlace, 'success');
        } catch (err) {
            return next(err)
        }
    },

}

export default eventController;


