import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({

    //ticketId: String,
    eventId: String,
    sessionId: String,
    area: String,
    seat: String,
    price: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    updateAt: {
        type: Date,
        default: Date.now,
        select: false
    }
});

const Ticket = mongoose.model("tickets", ticketSchema);

export default Ticket;