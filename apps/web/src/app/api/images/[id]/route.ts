import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Imagem from '@/lib/models/Imagem';

// GET /api/images/:id - Retorna imagem
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const imagem = await Imagem.findById(id);

    if (!imagem) {
      return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 });
    }

    // Converte base64 para buffer
    const buffer = Buffer.from(imagem.data, 'base64');

    // Retorna a imagem com o content-type correto
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': imagem.contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache de 1 ano
      },
    });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/images/:id - Remove imagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const imagem = await Imagem.findByIdAndDelete(id);

    if (!imagem) {
      return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Imagem removida' });
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
