import mongoose, { Schema, Document } from 'mongoose';

export interface IAluno extends Document {
  autoescolaId: mongoose.Types.ObjectId;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  categoriaDesejada: string;
  status: 'ativo' | 'concluido' | 'cancelado';
  createdAt: Date;
  updatedAt: Date;
}

const AlunoSchema = new Schema<IAluno>(
  {
    autoescolaId: { type: Schema.Types.ObjectId, ref: 'Autoescola', required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    cpf: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    categoriaDesejada: { type: String, required: true },
    status: { type: String, enum: ['ativo', 'concluido', 'cancelado'], default: 'ativo' },
  },
  { timestamps: true }
);

AlunoSchema.index({ autoescolaId: 1, cpf: 1 }, { unique: true });

export default mongoose.models.Aluno || mongoose.model<IAluno>('Aluno', AlunoSchema);
