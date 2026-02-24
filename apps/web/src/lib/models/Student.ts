import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  drivingSchoolId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: Date;
  desiredCategory: string;
  status: 'active' | 'completed' | 'cancelled';
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    drivingSchoolId: { type: Schema.Types.ObjectId, ref: 'DrivingSchool', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    cpf: { type: String, required: true },
    birthDate: { type: Date, required: true },
    desiredCategory: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

StudentSchema.index({ drivingSchoolId: 1, cpf: 1 }, { unique: true });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
