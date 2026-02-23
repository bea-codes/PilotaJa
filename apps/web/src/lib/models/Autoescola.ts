import mongoose, { Schema, Document } from 'mongoose';

export interface IAutoescola extends Document {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AutoescolaSchema = new Schema<IAutoescola>(
  {
    nome: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: {
      rua: { type: String, required: true },
      numero: { type: String, required: true },
      bairro: { type: String, required: true },
      cidade: { type: String, required: true },
      estado: { type: String, required: true },
      cep: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Autoescola || mongoose.model<IAutoescola>('Autoescola', AutoescolaSchema);
