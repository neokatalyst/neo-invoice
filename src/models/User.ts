import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  company?: string;
}

const UserSchema = new Schema<IUser>({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
