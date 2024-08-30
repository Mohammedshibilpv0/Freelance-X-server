import mongoose, { Document, Schema } from 'mongoose';

interface IConversation extends Document {
  user1: mongoose.Types.ObjectId; 
  user2: mongoose.Types.ObjectId; 
  firstName: string;
  lastName: string;
  createdAt: Date; 
  updatedAt: Date;  
}

const ConversationSchema: Schema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { 
    timestamps: true 
  }
);

ConversationSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
