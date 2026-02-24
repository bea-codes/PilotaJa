import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  data: string; // Base64
  contentType: string;
  filename?: string;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    data: { type: String, required: true },
    contentType: { type: String, required: true },
    filename: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);
