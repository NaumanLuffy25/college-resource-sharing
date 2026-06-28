import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    department: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    role: { type: String, enum: ['student', 'moderator', 'admin'], default: 'student' },
    interests: [{ type: String }],
    uploadCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ department: 1, semester: 1 });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
