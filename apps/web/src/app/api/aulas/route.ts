import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Aula } from '@/lib/models';

// GET /api/aulas - Lista aulas (com filtros opcionais)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const autoescolaId = searchParams.get('autoescolaId');
    const instrutorId = searchParams.get('instrutorId');
    const alunoId = searchParams.get('alunoId');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const status = searchParams.get('status');

    const query: any = {};
    
    if (autoescolaId) query.autoescolaId = autoescolaId;
    if (instrutorId) query.instrutorId = instrutorId;
    if (alunoId) query.alunoId = alunoId;
    if (status) query.status = status;
    
    if (dataInicio || dataFim) {
      query.dataHora = {};
      if (dataInicio) query.dataHora.$gte = new Date(dataInicio);
      if (dataFim) query.dataHora.$lte = new Date(dataFim);
    }

    const aulas = await Aula.find(query)
      .populate('alunoId', 'nome email telefone')
      .populate('instrutorId', 'nome email telefone')
      .sort({ dataHora: 1 })
      .limit(100);

    return NextResponse.json(aulas);
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/aulas - Cria nova aula
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { autoescolaId, alunoId, instrutorId, dataHora, duracao, tipo, observacoes } = body;

    // Validação básica
    if (!autoescolaId || !alunoId || !instrutorId || !dataHora || !tipo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: autoescolaId, alunoId, instrutorId, dataHora, tipo' },
        { status: 400 }
      );
    }

    // Verifica conflito de horário do instrutor
    const dataAula = new Date(dataHora);
    const duracaoMinutos = duracao || 50;
    const fimAula = new Date(dataAula.getTime() + duracaoMinutos * 60000);

    const conflito = await Aula.findOne({
      instrutorId,
      status: { $in: ['agendada', 'confirmada'] },
      $or: [
        { dataHora: { $gte: dataAula, $lt: fimAula } },
        {
          $expr: {
            $and: [
              { $lt: ['$dataHora', fimAula] },
              { $gt: [{ $add: ['$dataHora', { $multiply: ['$duracao', 60000] }] }, dataAula] }
            ]
          }
        }
      ]
    });

    if (conflito) {
      return NextResponse.json(
        { error: 'Instrutor já tem aula agendada neste horário' },
        { status: 409 }
      );
    }

    const aula = new Aula({
      autoescolaId,
      alunoId,
      instrutorId,
      dataHora: dataAula,
      duracao: duracaoMinutos,
      tipo,
      observacoes,
      status: 'agendada',
    });

    await aula.save();

    return NextResponse.json(aula, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
