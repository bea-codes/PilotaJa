import mongoose, { Schema, Document } from 'mongoose';

export interface IImagem extends Document {
  data: string; // Base64
  contentType: string;
  filename?: string;
  createdAt: Date;
}

const ImagemSchema = new Schema<IImagem>(
  {
    data: { type: String, required: true },
    contentType: { type: String, required: true },
    filename: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Imagem || mongoose.model<IImagem>('Imagem', ImagemSchema);
