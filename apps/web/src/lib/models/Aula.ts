import mongoose, { Schema, Document } from 'mongoose';

export interface IAula extends Document {
  autoescolaId: mongoose.Types.ObjectId;
  alunoId: mongoose.Types.ObjectId;
  instrutorId: mongoose.Types.ObjectId;
  dataHora: Date;
  duracao: number;
  tipo: 'pratica' | 'teorica' | 'simulador';
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'falta';
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AulaSchema = new Schema<IAula>(
  {
    autoescolaId: { type: Schema.Types.ObjectId, ref: 'Autoescola', required: true },
    alunoId: { type: Schema.Types.ObjectId, ref: 'Aluno', required: true },
    instrutorId: { type: Schema.Types.ObjectId, ref: 'Instrutor', required: true },
    dataHora: { type: Date, required: true },
    duracao: { type: Number, required: true, default: 50 },
    tipo: { type: String, enum: ['pratica', 'teorica', 'simulador'], required: true },
    status: { 
      type: String, 
      enum: ['agendada', 'confirmada', 'realizada', 'cancelada', 'falta'], 
      default: 'agendada' 
    },
    observacoes: { type: String },
  },
  { timestamps: true }
);

// Índices para queries frequentes
AulaSchema.index({ autoescolaId: 1, dataHora: 1 });
AulaSchema.index({ instrutorId: 1, dataHora: 1 });
AulaSchema.index({ alunoId: 1, dataHora: 1 });

export default mongoose.models.Aula || mongoose.model<IAula>('Aula', AulaSchema);
