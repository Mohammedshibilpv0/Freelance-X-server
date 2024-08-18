import mongoose, { Document, Schema } from 'mongoose';
import {IUserPost} from '../../../doamin/entities/UserPost'

const userPostSchema = new Schema<IUserPost>({
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    deadline: { type: Date, required: true },
    startBudget: { type: String, required: true },
    endBudget: { type: String, required: true }, 
    keyPoints: { type: [String], required: true }, 
    skills: { type: [String], required: true }, 
    images: { type: [String], required: true }, 
    searchKey: { type: [String], required: true },
  });

const UserPost = mongoose.model<IUserPost>('userPost', userPostSchema);

export default UserPost;
