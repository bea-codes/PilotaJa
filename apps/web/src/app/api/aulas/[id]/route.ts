import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Aula } from '@/lib/models';

// GET /api/aulas/[id] - Busca aula por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const aula = await Aula.findById(id)
      .populate('alunoId', 'nome email telefone')
      .populate('instrutorId', 'nome email telefone');

    if (!aula) {
      return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 });
    }

    return NextResponse.json(aula);
  } catch (error) {
    console.error('Erro ao buscar aula:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PATCH /api/aulas/[id] - Atualiza aula
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const aula = await Aula.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!aula) {
      return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 });
    }

    return NextResponse.json(aula);
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/aulas/[id] - Remove aula
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const aula = await Aula.findByIdAndDelete(id);

    if (!aula) {
      return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Aula removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover aula:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
