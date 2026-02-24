import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  drivingSchoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  instructorId: mongoose.Types.ObjectId;
  dateTime: Date;
  duration: number;
  type: 'practical' | 'simulator' | 'theoretical';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    drivingSchoolId: { type: Schema.Types.ObjectId, ref: 'DrivingSchool', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },
    dateTime: { type: Date, required: true },
    duration: { type: Number, default: 50 },
    type: { type: String, enum: ['practical', 'simulator', 'theoretical'], required: true },
    status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'noshow'], default: 'scheduled' },
    notes: { type: String },
  },
  { timestamps: true }
);

LessonSchema.index({ drivingSchoolId: 1, dateTime: 1 });
LessonSchema.index({ studentId: 1, dateTime: 1 });
LessonSchema.index({ instructorId: 1, dateTime: 1 });

export default mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);
