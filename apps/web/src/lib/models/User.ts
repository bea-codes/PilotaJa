import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  drivingSchoolId: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: 'admin' | 'instructor' | 'student';
  studentId?: mongoose.Types.ObjectId;
  instructorId?: mongoose.Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    drivingSchoolId: { type: Schema.Types.ObjectId, ref: 'DrivingSchool', required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'instructor', 'student'], required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    instructorId: { type: Schema.Types.ObjectId, ref: 'Instructor' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ drivingSchoolId: 1, email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
