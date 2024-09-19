import mongoose, { Schema, Document,Query } from "mongoose";
import { IFreelancerGig } from "../../../doamin/entities/IFreelancerGig";

const FormValuesSchema = new Schema<IFreelancerGig>({
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String },
  createAt: { type: Date, default: Date.now },
  subcategory: { type: String },
  status: { type: String, default: "Pending" },
  isBlock:{type:Boolean , default:false},
  isDelete:{type:Boolean , default:false},
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
  deadline: { type: String, required: true },
  searchTags: { type: [String], required: true },
  images: { type: [String], required: true },
  price: { type: Schema.Types.Mixed, required: true },
  paymentAmount:{type:Number},
  
});

FormValuesSchema.pre(/^find/, function (next) {
  const query = this as Query<any, Document>;  
  query.where({ isDelete: false });            
  next();
});
const FreelancerGig = mongoose.model<IFreelancerGig>("Gig", FormValuesSchema);

export default FreelancerGig;
