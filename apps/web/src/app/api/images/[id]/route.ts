import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Image } from '@/lib/models';

// GET /api/images/:id - Retorna imagem
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const image = await Image.findById(id);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(image.data, 'base64');

    // Return image with correct content-type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': image.contentType,
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
    const image = await Image.findByIdAndDelete(id);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
