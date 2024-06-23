import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: [true, "請輸入標籤名稱"],
  },
  tagStatus: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    select: true,
  }
}, {
    versionKey: false
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
