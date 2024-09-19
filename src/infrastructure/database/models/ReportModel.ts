import mongoose, { Document, Schema, Model, model } from 'mongoose';

export interface IReport extends Document {
  reportedUserId: mongoose.Types.ObjectId;                                        
  reporterUserId: mongoose.Types.ObjectId;                                         
  reason: 'Spam' | 'Inappropriate Content' | 'Harassment' | 'Other'; 
  customReason?: string; 
  status: 'pending' | 'reviewed' | 'resolved';                                       
  createdAt: Date;                                 
}

const reportSchema: Schema<IReport> = new Schema({
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporterUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ['Spam', 'Inappropriate Content', 'Harassment', 'Other'],
  },
  customReason: {
    type: String,
    required: function() { return this.reason === 'Other'; },
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'reviewed', 'resolved'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report: Model<IReport> = model<IReport>('Report', reportSchema);
export default Report;
