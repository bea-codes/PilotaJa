import mongoose, { Schema, Document } from 'mongoose';

export interface IInstrutor extends Document {
  autoescolaId: mongoose.Types.ObjectId;
  nome: string;
  email: string;
  telefone: string;
  cnh: string;
  categorias: string[];
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstrutorSchema = new Schema<IInstrutor>(
  {
    autoescolaId: { type: Schema.Types.ObjectId, ref: 'Autoescola', required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    cnh: { type: String, required: true },
    categorias: [{ type: String, required: true }],
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

InstrutorSchema.index({ autoescolaId: 1, cnh: 1 }, { unique: true });

export default mongoose.models.Instrutor || mongoose.model<IInstrutor>('Instrutor', InstrutorSchema);
