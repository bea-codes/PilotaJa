import mongoose, { Schema, Document } from 'mongoose';

export interface IInstructor extends Document {
  drivingSchoolId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  license: string;
  categories: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstructorSchema = new Schema<IInstructor>(
  {
    drivingSchoolId: { type: Schema.Types.ObjectId, ref: 'DrivingSchool', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    license: { type: String, required: true },
    categories: [{ type: String, required: true }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

InstructorSchema.index({ drivingSchoolId: 1, license: 1 }, { unique: true });

export default mongoose.models.Instructor || mongoose.model<IInstructor>('Instructor', InstructorSchema);
