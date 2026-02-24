import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Autoescola, Instrutor, Aluno, Aula } from '@/lib/models';

// POST /api/seed - Popula dados iniciais para testes
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verifica se já existe dados
    const existingAutoescola = await Autoescola.findOne();
    if (existingAutoescola) {
      return NextResponse.json({ 
        message: 'Dados já existem. Use DELETE primeiro para limpar.',
        autoescola: existingAutoescola
      }, { status: 200 });
    }

    // 1. Criar Autoescola
    const autoescola = await Autoescola.create({
      nome: 'Auto Escola PilotaJá',
      cnpj: '12.345.678/0001-99',
      endereco: {
        rua: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      },
      telefone: '(11) 99999-9999',
      email: 'contato@pilotaja.com.br',
    });

    // 2. Criar Instrutores
    const instrutores = await Instrutor.create([
      {
        nome: 'Carlos Silva',
        email: 'carlos@pilotaja.com.br',
        telefone: '(11) 98888-1111',
        autoescolaId: autoescola._id,
        cnh: {
          numero: '12345678900',
          categoria: 'D',
          validade: new Date('2028-12-31'),
        },
        ativo: true,
      },
      {
        nome: 'Maria Santos',
        email: 'maria@pilotaja.com.br',
        telefone: '(11) 98888-2222',
        autoescolaId: autoescola._id,
        cnh: {
          numero: '12345678901',
          categoria: 'B',
          validade: new Date('2027-06-30'),
        },
        ativo: true,
      },
      {
        nome: 'João Oliveira',
        email: 'joao@pilotaja.com.br',
        telefone: '(11) 98888-3333',
        autoescolaId: autoescola._id,
        cnh: {
          numero: '12345678902',
          categoria: 'AB',
          validade: new Date('2029-03-15'),
        },
        ativo: true,
      },
    ]);

    // 3. Criar Aluno (Cassio)
    const aluno = await Aluno.create({
      nome: 'Cassio Basile',
      email: 'cassio@email.com',
      telefone: '(11) 97777-7777',
      cpf: '123.456.789-00',
      autoescolaId: autoescola._id,
      dataNascimento: new Date('1990-01-01'),
      categoria: 'B',
      ativo: true,
    });

    // 4. Criar algumas aulas de exemplo
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const semanaQueVem = new Date(hoje);
    semanaQueVem.setDate(hoje.getDate() + 7);

    const aulas = await Aula.create([
      {
        autoescolaId: autoescola._id,
        alunoId: aluno._id,
        instrutorId: instrutores[0]._id,
        dataHora: new Date(amanha.setHours(10, 0, 0, 0)),
        duracao: 50,
        tipo: 'pratica',
        status: 'agendada',
      },
      {
        autoescolaId: autoescola._id,
        alunoId: aluno._id,
        instrutorId: instrutores[1]._id,
        dataHora: new Date(semanaQueVem.setHours(14, 0, 0, 0)),
        duracao: 50,
        tipo: 'pratica',
        status: 'agendada',
      },
      // Algumas aulas passadas (realizadas)
      {
        autoescolaId: autoescola._id,
        alunoId: aluno._id,
        instrutorId: instrutores[0]._id,
        dataHora: new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
        duracao: 50,
        tipo: 'pratica',
        status: 'realizada',
      },
      {
        autoescolaId: autoescola._id,
        alunoId: aluno._id,
        instrutorId: instrutores[2]._id,
        dataHora: new Date(hoje.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 dias atrás
        duracao: 50,
        tipo: 'pratica',
        status: 'realizada',
      },
    ]);

    return NextResponse.json({
      message: 'Dados criados com sucesso!',
      data: {
        autoescola: {
          _id: autoescola._id,
          nome: autoescola.nome,
        },
        instrutores: instrutores.map((i: any) => ({ _id: i._id, nome: i.nome })),
        aluno: {
          _id: aluno._id,
          nome: aluno.nome,
        },
        aulas: aulas.length,
      },
      // IDs para usar no app mobile
      config: {
        autoescolaId: autoescola._id.toString(),
        alunoId: aluno._id.toString(),
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar seed:', error);
    return NextResponse.json({ error: 'Erro ao criar dados iniciais', details: String(error) }, { status: 500 });
  }
}

// DELETE /api/seed - Limpa todos os dados (cuidado!)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    await Promise.all([
      Aula.deleteMany({}),
      Aluno.deleteMany({}),
      Instrutor.deleteMany({}),
      Autoescola.deleteMany({}),
    ]);

    return NextResponse.json({ message: 'Todos os dados foram removidos' });
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return NextResponse.json({ error: 'Erro ao limpar dados' }, { status: 500 });
  }
}

// GET /api/seed - Verifica status dos dados
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const [autoescolas, instrutores, alunos, aulas] = await Promise.all([
      Autoescola.countDocuments(),
      Instrutor.countDocuments(),
      Aluno.countDocuments(),
      Aula.countDocuments(),
    ]);

    const aluno = await Aluno.findOne();
    const autoescola = await Autoescola.findOne();

    return NextResponse.json({
      status: autoescolas > 0 ? 'populated' : 'empty',
      counts: { autoescolas, instrutores, alunos, aulas },
      config: aluno && autoescola ? {
        autoescolaId: autoescola._id.toString(),
        alunoId: aluno._id.toString(),
      } : null,
    });
  } catch (error) {
    console.error('Erro ao verificar seed:', error);
    return NextResponse.json({ error: 'Erro ao verificar dados' }, { status: 500 });
  }
}
