// import mongoose, { Document, Schema } from 'mongoose';

// interface IMessage extends Document {
//   conversationId: mongoose.Types.ObjectId;
//   sender: mongoose.Types.ObjectId;
//   text: string;
//   timestamp: Date;
// }

// const MessageSchema: Schema = new Schema(
//   {
//     conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
//     sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     text: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model<IMessage>('Message', MessageSchema);

// export default Message;


import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read'; 
  messageId:string
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, 
    messageId:{type:String}
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
