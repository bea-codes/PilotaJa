import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  email: string;
  senha: string;
  nome: string;
  role: 'admin' | 'autoescola' | 'instrutor' | 'aluno';
  autoescolaId?: mongoose.Types.ObjectId;
  instrutorId?: mongoose.Types.ObjectId;
  alunoId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    senha: { type: String, required: true },
    nome: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['admin', 'autoescola', 'instrutor', 'aluno'], 
      required: true 
    },
    autoescolaId: { type: Schema.Types.ObjectId, ref: 'Autoescola' },
    instrutorId: { type: Schema.Types.ObjectId, ref: 'Instrutor' },
    alunoId: { type: Schema.Types.ObjectId, ref: 'Aluno' },
  },
  { timestamps: true }
);

// Hash password before saving
UsuarioSchema.pre('save', async function () {
  if (!this.isModified('senha')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Compare password method
UsuarioSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.senha);
};

export default mongoose.models.Usuario || mongoose.model<IUsuario>('Usuario', UsuarioSchema);
