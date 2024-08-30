import mongoose, { Schema, Document } from 'mongoose';

export interface INotification {
    time: Date;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
}
const NotificationSchema = new Schema<INotification>({
  time: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
});

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
