import mongoose, { Document, Schema } from 'mongoose';

interface IPaymentTransaction extends Document {
  transactionId: string;
  receiverId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentTransactionSchema: Schema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PaymentTransactionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const PaymentTransaction = mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);

export default PaymentTransaction;
