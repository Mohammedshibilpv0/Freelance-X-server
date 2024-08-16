import mongoose, { Document, Schema, Query } from 'mongoose';
import { ICategory } from '../../../doamin/entities/Category'; 

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isDeleted: { type: Boolean, default: false }, 
});

categorySchema.pre<Query<ICategory, Document>>(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
