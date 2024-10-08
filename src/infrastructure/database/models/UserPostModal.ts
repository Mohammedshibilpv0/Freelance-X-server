import mongoose, { Document, Schema, Query } from "mongoose";
import { IUserPost } from "../../../doamin/entities/UserPost";

const userPostSchema = new Schema<IUserPost>({
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  deadline: { type: Date, required: true },
  status: { type: String, default: "Pending" },
  requests: [
    {
      message: { type: String, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      price: { type: Number, required: true },
      status: { type: String, default: "Not request" },
    },
  ],
  modules: [
    {
      heading: { type: String },
      date: { type: Date },
      amount: { type: Number },
      isPaid: { type: Boolean, default: false },
    },
  ],
  paymentAmount: { type: Number },
  startBudget: { type: Number, required: true },
  endBudget: { type: Number, required: true },
  keyPoints: { type: [String], required: true },
  skills: { type: [String], required: true },
  images: { type: [String], required: true },
  searchKey: { type: [String], required: true },
  isBlock: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
});

userPostSchema.pre(/^find/, function (next) {
  const query = this as Query<any, Document>;  
  query.where({ isDelete: false });            
  next();
});

const UserPost = mongoose.model<IUserPost>("userPost", userPostSchema);

export default UserPost;
