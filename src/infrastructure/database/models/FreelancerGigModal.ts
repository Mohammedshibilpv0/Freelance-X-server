import mongoose, { Schema, Document } from 'mongoose';
import { IFreelancerGig } from '../../../doamin/entities/IFreelancerGig';


const FormValuesSchema = new Schema<IFreelancerGig>({
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String},
    createAt: { type: Date, default: Date.now },
    subcategory: { type:String}, 
    deadline: { type: String, required: true },
    searchTags: { type: [String], required: true },
    images: { type: [String], required: true },
    price: { type: Schema.Types.Mixed, required: true }
  });
  
  const FreelancerGig = mongoose.model<IFreelancerGig>('Gig', FormValuesSchema);
  
  export default FreelancerGig;