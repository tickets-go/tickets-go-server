import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

    ticketName: String,
    areaName: String,
    areaPrice: Number,
    price: Number,
    seats: Array,
    ticketCount: Number,
    userId: String,
    eventId: String,
    sessinId: String,
    orderStatus: String,
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

    // name: {
    //     type: String,
    //     required: [true, "請輸入活動名稱"]
    // },
    // intro:{
    //     type: String,
    //     required: [true,"請輸入活動簡述"]
    // },
    // content: {
    //     type: String,
    //     required: [true, "請輸入活動內容"]
    // },
    // introImage: {
    //     type: String,
    //     required: [true, "請上傳圖片一"]
    // },
    // bannerImage: {
    //     type: String,
    //     required: [true, "請上傳圖片二"]
    // },
    // organizer: {
    //     type: String,
    //     required: [true, "請輸入主辦單位"]
    // },
    // eventRange: {
    //     type: Object,
    //     startDate: { 
    //         type: Number, 
    //         required: [true, "請輸入開始時間"]
    //     },
    //     endTime: { 
    //         type: Number,
    //         required: [true, "請輸入結束時間"]
    //     }
    // },
    // payments: {
    //     type: Array,
    //     required: [true, "請選擇付款方式"]
    // },
    // tags: {
    //     type: Array,
    //     required: [true, "請選擇分類標籤"]
    // },
    // sessions: {
    //     type: Array,
    //     date: {
    //         type: Number,
    //         required: [true, "請輸入日期"]
    //     },
    //     timeRange: {
    //         type: Object,
    //         startTime: {
    //             type: Number,
    //             required: [true, "請輸入開始時間"]
    //         },
    //         endTime: {
    //             type: Number,
    //             required: [true, "請輸入結束時間"]
    //         },
    //     },
    //     place: {
    //         type: String,
    //         required: [true, "請輸入演出地點"]
    //     }
    // },
    // prices: {
    //     type: Array,
    //     area: {
    //         type: String,
    //         required: [true, "請輸入區域"]
    //     },
    //     price: {
    //         type: Number,
    //         required: [true, "請輸入價格"]
    //     },
    //     mount: {
    //         type: Number,
    //         required: [true, "請輸入數量"]
    //     }
    // }
});

const Order = mongoose.model("orders", orderSchema);

export default Order;