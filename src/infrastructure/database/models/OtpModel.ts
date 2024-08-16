import mongoose, { Document, Schema } from 'mongoose';

interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: Date.now, index: { expires: '2m' } }
});

otpSchema.pre<IOtp>('save', function (next) {
  this.expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
  next();
});

const Otp = mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;
