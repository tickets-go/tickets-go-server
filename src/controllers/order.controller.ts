import { Request, Response, NextFunction } from 'express'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import Event from '../models/event.model'
import Session from '../models/session.model'
import Ticket from '../models/ticket.model'
import Order from '../models/order.model'
import validator from 'validator'

const orderController = {
    // query tickets
    async queryTickets(req: Request, res: Response, next: NextFunction) {
        try {


            console.log(req.query);
            console.log(req.query.eventId);
            console.log(req.query.sessionId);

            const eventId = req.query.eventId;
            const sessionId = req.query.sessionId;

            const event = await Event.findById({ _id: eventId });
            const session = await Session.findById({ _id: sessionId });
            const tickets = await Ticket.find({ sessionId: sessionId, status: 0 });

            console.log(event);
            console.log(session);
            //需再把區域合併算數量
            console.log(tickets);

            handleSuccess(res, tickets, 'success')

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

            var price;
            for (var i = 0; i < seats.length; i++) {
                let number = seats[i].number;
                let ticket = await Ticket.findOneAndUpdate(
                    { sessionId: sessionId, area: areaName, seat: number },
                    { status: "1" }
                );
                price = ticket?.price;
            }

            const newOrder = await Order.create({
                ticketName: session?.sessionName,
                areaName: areaName,
                areaPrice: price,
                price: price != null ? price * count : 0, //之後再改
                seats: seats,
                ticketCount: count,
                userId: userName,
                eventId: session?.eventId,
                sessinId: session?._id,
                orderStatus: "1",
                // createdAt: Date.now,
                // updateAt: Date.now
            });

            handleSuccess(res, newOrder, 'success')

        } catch (err) {
            return next(err)
        }
    }
}

export default orderController;


