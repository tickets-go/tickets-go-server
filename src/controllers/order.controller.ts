import { Request, Response, NextFunction } from 'express'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import Event from '../models/event.model'
import Session from '../models/session.model'
import Ticket from '../models/ticket.model'
import Order from '../models/order.model'
import Place from '../models/place.model'

const orderController = {
    // query tickets
    async queryTickets(req: Request, res: Response, next: NextFunction) {
        try {

            const eventId = req.query.eventId;
            const sessionId = req.query.sessionId;

            const event = await Event.findById({ _id: eventId });
            if (event == null) {
                return handleError(res, createError(400, '找不到活動'));
            }

            const session = await Session.findById({ _id: sessionId });
            if (session == null) {
                return handleError(res, createError(400, '找不到場次'));
            }


            const tickets = await Ticket.find({ sessionId: sessionId, status: "0" });
            if (tickets == null) {
                return handleError(res, createError(400, '該場次的票已賣完'));
            }

            const place = await Place.findOne({ placeName: session.sessionPlace });
            if (place == null) {
                return handleError(res, createError(400, '找不到場地'));
            }

            var ticketArr = [];
            const areas = place.area;
            for (var i = 0; i < areas.length; i++) {
                var areaName = areas[i].areaName;
                var count = tickets.filter((ticket) => ticket.areaName == areaName).length;

                ticketArr.push({
                    "areaName": areaName,
                    "count": count
                });
            }

            var result = {
                "eventId": eventId,
                "eventName": event.eventName,
                "eventContent": event.eventContent,
                "eventImages": event.introImage,
                "sessionId": sessionId,
                "sessionDate": session.sessionStartTime,
                "tickets": ticketArr,

            };

            handleSuccess(res, result, 'success')

        } catch (err) {
            return next(err)
        }
    },
    // query tickets
    async querySeats(req: Request, res: Response, next: NextFunction) {
        try {

            const sessionId = req.body.sessionId;
            const areaName = req.body.areaName;

            // const sessionId = req.query.sessionId;
            // const areaName = req.query.areaName;

            const tickets = await Ticket.find({
                sessionId: sessionId,
                areaName: areaName,
                status: "0"
            });
            if (tickets == null) {
                return handleError(res, createError(400, '該場次區域的票已賣完'));
            }

            var ticketArr = [];
            for (var i = 0; i < tickets.length; i++) {
                var ticket = tickets[i];
                ticketArr.push({ row: ticket.seatRow, number: ticket.seatNumber });
            }

            var result = {
                "sessionId": sessionId,
                "areaName": areaName,
                "seats": ticketArr
            };

            handleSuccess(res, result, 'success')

        } catch (err) {
            return next(err)
        }
    },
    async lockSeat(req: Request, res: Response, next: NextFunction) {
        try {

            const sessionId = req.body.sessionId;
            const areaName = req.body.areaName;
            const seatRow = req.body.seatRow;
            const seatNumber = req.body.seatNumber;

            const tickets = await Ticket.findOneAndUpdate(
                {
                    sessionId: sessionId,
                    areaName: areaName,
                    seatRow: seatRow,
                    seatNumber: seatNumber,
                    status: "0"
                },
                {
                    status: "1"
                }
            );
            if (tickets == null) {
                return handleError(res, createError(400, '該座位已售出'));
            }

            const remainSeats = await Ticket.find(
                {
                    sessionId: sessionId,
                    areaName: areaName,
                    status: "0"
                }
            );
            if (remainSeats == null) {
                return handleError(res, createError(400, '此區域全部完售'));
            }

            var ticketArr = [];
            for (var i = 0; i < remainSeats.length; i++) {
                var ticket = remainSeats[i];
                ticketArr.push(
                    {
                        seatRow: ticket.seatRow,
                        seatNumber: ticket.seatNumber
                    }
                );
            }


            var result = {
                "message": "更新成功",
                "sessionId": sessionId,
                "areaName": areaName,
                "seatRow": seatRow,
                "seatNumber": seatNumber,
                "remainSeats": ticketArr
            };

            handleSuccess(res, result, 'success')

        } catch (err) {
            return next(err)
        }
    },
    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {

            const orderReq = req.body;
            const userName = orderReq.userName;
            const sessionId = orderReq.sessionId;
            const areaName = orderReq.areaName;
            const count = orderReq.count;
            const seats = orderReq.seats;

            const session = await Session.findById({ _id: sessionId });
            if (session == null) {
                return handleError(res, createError(400, '找不到場次'));
            }

            var price;
            for (var i = 0; i < seats.length; i++) {
                var row = seats[i].row;
                let number = seats[i].number;
                var ticket = await Ticket.findOneAndUpdate(
                    {
                        sessionId: sessionId,
                        areaName: areaName,
                        seatRow: row,
                        seatNumber: number,
                        status: "0"
                    }
                    ,
                    {
                        status: "2"
                    }
                );
                console.log(ticket);
                price = ticket?.price;
            }
            if (price == null) {
                return handleError(res, createError(400, '找不到價格'));
            }

            var seatArr = [];
            for (var i = 0; i < seats.length; i++) {
                seatArr.push({ seatRow: seats[i].row, seatNumber: seats[i].number });
            }

            const newOrder = await Order.create({
                ticketName: session.sessionName,
                areaName: areaName,
                areaPrice: price,
                price: price * count,
                seats: seatArr,
                ticketCount: count,
                userId: userName,
                eventId: session.eventId,
                sessinId: session._id,
                orderStatus: "0"
                // createdAt: {default: Date.now}
                // updateAt: {default: Date.now}
            });

            handleSuccess(res, newOrder, 'success')

        } catch (err) {
            return next(err)
        }
    },
    async queryOrder(req: Request, res: Response, next: NextFunction) {
        try {

            const orderId = req.params.orderId;

            const order = await Order.findById({ _id: orderId });
            if (order == null) {
                return handleError(res, createError(400, '找不到訂單'));
            }

            var result = {
                "orderId": orderId,
                "status": order.orderStatus //0:訂單成立、1:付款完成、2.付款失敗
            };

            handleSuccess(res, result, 'success')

        } catch (err) {
            return next(err)
        }
    }
}

export default orderController;


