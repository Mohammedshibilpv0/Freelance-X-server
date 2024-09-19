import mongoose, { Schema} from 'mongoose';

export interface INotification {
    time: Date;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    link:string
    read:boolean
    type:'message' | 'payment' | 'job' | 'other'
}
const NotificationSchema= new Schema<INotification>({
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
  read: {
    type: Boolean,
    default: false
  },
  message: { 
    type: String, 
    required: true 
  },
  link: {
    type: String
  },
  type: {  
    type: String,
    enum: ['message', 'payment', 'job', 'other'],  
    required: true
  }
});

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;