import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({

    //_id: 自動產生
    eventName: { type: String, required: [true, "請輸入活動名稱"] },
    eventIntro: { type: String, required: [true, "請輸入活動簡述"] },
    eventContent: { type: String, required: [true, "請輸入活動內容"] },
    introImage: { type: String, required: [true, "請上傳圖片一"] },
    bannerImage: { type: String, required: [true, "請上傳圖片二"] },
    organizer: { type: String, required: [true, "請輸入主辦單位"] },
    eventStartDate: { type: Date, required: [true, "請輸入活動開始時間"] },
    eventEndDate: { type: Date, required: [true, "請輸入活動結束時間"] },
    releaseDate: { type: Date, required: [true, "請輸入賣票時間"] },
    payments: [{ type: String, required: [true, "請選擇付款方式"] }],
    tags: [{ type: String, enum: ['小巨蛋', '韓國團體'], required: false }],
    category: [{ type: String, enum: ['演唱會', '韓國團體'], required: [true, "請輸入活動類別"] }],

    createdAt: { type: Date, default: Date.now, select: false },
    updateAt: { type: Date, default: Date.now, select: false }
});

const Event = mongoose.model("events", eventSchema);

export default Event;