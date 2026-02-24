import mongoose, { Schema, Document } from 'mongoose';

export interface IDrivingSchool extends Document {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DrivingSchoolSchema = new Schema<IDrivingSchool>(
  {
    name: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      neighborhood: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.DrivingSchool || mongoose.model<IDrivingSchool>('DrivingSchool', DrivingSchoolSchema);
