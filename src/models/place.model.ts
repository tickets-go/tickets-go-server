import mongoose from "mongoose";


const placeSchema = new mongoose.Schema({
    //_id 自動產生
    placeName: { type: String, required: [true, "請輸入場地名稱"] },
    area: [
        {
            areaName: { type: String, required: [true, "請輸入區域名稱"] },
            areaRow: { type: Number, required: [true, "請輸入區域排數"] },
            areaNumber: { type: Number, required: [true, "請輸入區域座位號碼"] },
        }
    ],
    createdAt: { type: Date, default: Date.now, select: false },
    updateAt: { type: Date, default: Date.now, select: false }
});

const Place = mongoose.model("places", placeSchema);

export default Place;