import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Aluno } from '@/lib/models';

// GET /api/alunos - Lista alunos
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const autoescolaId = searchParams.get('autoescolaId');

    const query: any = {};
    if (autoescolaId) query.autoescolaId = autoescolaId;

    const alunos = await Aluno.find(query)
      .select('nome email telefone categoriaDesejada status')
      .sort({ nome: 1 });

    return NextResponse.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
