import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

    //_id:自動產生
    ticketName: { type: String, required: [true, "請輸入票劵名稱"] },
    areaName: { type: String, required: [true, "請輸入區域名稱"] },
    areaPrice: { type: Number, required: [true, "請輸入區域價格"] },
    price: { type: Number, required: [true, "請輸入價錢"] },
    seats: [
        {
            seatRow: { type: Number, required: [true, "請輸入座位排數"] },
            seatNumber: { type: Number, required: [true, "請輸入座位號碼"] },
        }
    ],
    ticketCount: { type: Number, required: [true, "請輸入票數量"] },
    userId: { type: String, required: [true, "請輸入使用者id"] },
    eventId: { type: String, required: [true, "請輸入活動id"] },
    sessinId: { type: String, required: [true, "請輸入場次id"] },
    orderStatus: { type: String, required: [true, "請輸入訂單狀態"] },
    createdAt: { type: Date, default: Date.now, select: false },
    updateAt: { type: Date, default: Date.now, select: false }
});

const Order = mongoose.model("orders", orderSchema);

export default Order;