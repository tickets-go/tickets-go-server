import { Request, Response, NextFunction } from 'express'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import Event from '../models/event.model'
import Session from '../models/session.model'
import Ticket from '../models/ticket.model'
import validator from 'validator'

const eventController = {
    // register
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
            const eventRange = eventReq.eventRange;
            const startDate = eventReq.eventRange.startDate;
            const endDate = eventReq.eventRange.endDate;
            const payments = eventReq.payments;
            const tags = eventReq.tags;
            const sessions = eventReq.sessions;
            const prices = eventReq.prices;

            const newEvent = await Event.create({
                eventName: name,
                eventIntro: intro,
                eventContent: content,
                introImage: introImage,
                bannerImage: bannerImage,
                organizer: organizer,
                eventStartDate: startDate,
                eventEndDate: endDate,
                releaseDate: startDate,
                tagIds: tags,
                categoryId: "",
                // createdAt: Date.now,
                // updateAt: Date.now
            });


            //createSession
            console.log("sessions的長度:" + sessions.length);
            for (var i = 0; i < sessions.length; i++) {

                let session = sessions[i];
                let sessionDate = session.date;
                let a = session.timeRange.startTime;
                let b = session.timeRange.endTime;
                let place = session.place;

                let newSession = await Session.create({
                    eventId: newEvent._id,
                    sessionName: name,
                    sessionDate: sessionDate,
                    sessionPlace: place,
                    sessionStatus: "0",
                });

                //createTicket
                console.log(prices.length);
                for (var j = 0; j < prices.length; j++) {
                    let price = prices[j];
                    let mount = price.mount;
                    for (var k = 1; k <= mount; k++) {

                        let seat = k + "號";
                        const newTicket = await Ticket.create({
                            eventId: newEvent._id,
                            sessionId: newSession._id,
                            area: price.area,
                            seat: seat,
                            price: price.price,
                            status: "0",
                        });
                    }
                }
            }

            handleSuccess(res, newEvent, 'success')

        } catch (err) {
            return next(err)
        }
    },
    // get all events
    async getEvents(req: Request, res: Response, next: NextFunction) {
        try {

            //還需要加上參數條件查詢
            console.log(req.query);
            console.log(req.query.event);
            console.log( req.query.tag);
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
    async deleteEvents(req: Request, res: Response, next: NextFunction) {
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
            if (event) {
                handleSuccess(res, event, 'success');
            } else {
                handleSuccess(res, '找不到', 'success');
            }

            console.log(event);


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
    }
}

export default eventController;


