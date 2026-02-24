import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Image } from '@/lib/models';

// POST /api/upload - Faz upload de imagem
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { data, contentType, filename } = body;

    if (!data || !contentType) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: data (base64), contentType' },
        { status: 400 }
      );
    }

    // Remove prefixo data:image/...;base64, se existir
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');

    const image = new Image({
      data: base64Data,
      contentType,
      filename,
    });

    await image.save();

    // Return URL to access the image
    const imageUrl = `/api/images/${image._id}`;

    return NextResponse.json({ 
      id: image._id,
      url: imageUrl,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
