import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({

  //_id:自動產生
  eventId: { type: String, required: [true, "請輸入活動:_id"] },
  sessionName: { type: String, required: [true, "請輸入場次名稱"] },
  sessionStartDate: { type: Date, required: [true, "請輸入場次開始日期"] },
  sessionStartTime: { type: String, required: [true, "請輸入場次開始時間"] },
  sessionEndTime: { type: String, required: [true, "請輸入場次結束時間"] },
  sessionPlace: { type: String, required: [true, "請輸入場次舉辦地點"] },
  sessionStatus: { type: String, required: [true, "請輸入場次狀態"] },
  createdAt: { type: Date, default: Date.now, select: false },
  updateAt: { type: Date, default: Date.now, select: false }
});

const Session = mongoose.model("sessions", sessionSchema);

export default Session;