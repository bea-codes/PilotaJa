import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Instrutor } from '@/lib/models';

// GET /api/instrutores - Lista instrutores
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const autoescolaId = searchParams.get('autoescolaId');

    const query: any = { ativo: true };
    if (autoescolaId) query.autoescolaId = autoescolaId;

    const instrutores = await Instrutor.find(query)
      .select('nome email telefone categorias')
      .sort({ nome: 1 });

    return NextResponse.json(instrutores);
  } catch (error) {
    console.error('Erro ao buscar instrutores:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
