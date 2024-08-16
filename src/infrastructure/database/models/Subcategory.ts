import mongoose, { Document, Schema, Query } from 'mongoose';
import { ISubcategory } from '../../../doamin/entities/SubCategory'; 

const SubcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isDeleted: { type: Boolean, default: false },
});

SubcategorySchema.pre<Query<ISubcategory, Document>>(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

const SubCategory = mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);

export default SubCategory;
