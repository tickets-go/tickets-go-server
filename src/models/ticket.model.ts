import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({

    //_Id自動產生
    eventId: { type: String, required: [true, "請輸入活動:_id"] },
    sessionId: { type: String, required: [true, "請輸入場次:_id"] },
    areaName: { type: String, required: [true, "請輸入區域名稱"] },
    seatRow: { type: Number, required: [true, "請輸入座位排數"] },
    seatNumber: { type: Number, required: [true, "請輸入座位號碼"] },
    price: { type: Number, required: [true, "請輸入座位票價"] },
    status: { type: String, required: [true, "請輸入門票狀態"] },
    createdAt: { type: Date, default: Date.now, select: false },
    updateAt: { type: Date, default: Date.now, select: false }
});

const Ticket = mongoose.model("tickets", ticketSchema);

export default Ticket;