import { Request, Response, NextFunction } from 'express'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import Event from '../models/event.model'
import Session from '../models/session.model'


const homeController = {


    async findEvents(req: Request, res: Response, next: NextFunction) {
        try {

            const tags = req.query.tags;
            const startTime = req.query.startTime;
            const endTime = req.query.endTime;

            const events = await Event.find({
                "eventStartDate": { "$gt": startTime },
                "eventEndDate": { "$lt": endTime }
            });

            var array = [];

            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var sessions = await Session.find({ "eventId": event._id });

                var sessionArr = [];
                for (var j = 0; j < sessions.length; j++) {
                    var session = sessions[j];
                    sessionArr.push({
                        "location": session.sessionPlace,
                        "startDate": session.sessionStartDate,
                        "startTime": session.sessionStartTime,
                        "endTime": session.sessionEndTime
                    });
                }

                var oneEvent = {
                    "id": event._id,
                    "name": event.eventName,
                    "description": event.eventContent,
                    "sessions": sessionArr,
                    "tags": event.tags
                };

                array.push(oneEvent);
            }
            var result = { "events": array };

            handleSuccess(res, result, 'success')
        } catch (err) {
            return next(err)
        }
    },
    //未完成
    async findTags(req: Request, res: Response, next: NextFunction) {

    },
    async findEventDetail(req: Request, res: Response, next: NextFunction) {

        try {

            const eventId = req.params.eventId;

            const event = await Event.findById(eventId);
            if (event == null) {
                return handleError(res, createError(400, '此id找不到活動'))
            }

            var sessions = await Session.find({ "eventId": eventId });

            var sessionArr = [];
            for (var j = 0; j < sessions.length; j++) {
                var session = sessions[j];
                sessionArr.push({
                    "location": session.sessionPlace,
                    "startDate": session.sessionStartDate,
                    "startTime": session.sessionStartTime,
                    "endTime": session.sessionEndTime
                });
            }

            var oneEvent = {
                "id": event._id,
                "name": event.eventName,
                "description": event.eventContent,
                "sessions": sessionArr,
                "tags": event.tags
            };

            var result = { "events": oneEvent };

            handleSuccess(res, result, 'success')
        } catch (err) {
            return next(err)
        }
    },
}

export default homeController;


