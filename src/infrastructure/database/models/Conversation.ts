import mongoose, { Document, Schema } from 'mongoose';

interface IConversation extends Document {
  user1: mongoose.Types.ObjectId; 
  user2: mongoose.Types.ObjectId; 
  createdAt: Date; 
  updatedAt: Date;  
  lastMessage: string;
}

const ConversationSchema: Schema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: String, default: '' },
  },
  { 
    timestamps: true 
  }
);

ConversationSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
