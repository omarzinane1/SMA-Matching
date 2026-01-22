import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const offerId = formData.get('offerId') as string;

    if (!file || !offerId) {
      return NextResponse.json(
        { message: 'File et offerId requis' },
        { status: 400 }
      );
    }

    // Créer un FormData pour transférer le fichier au backend Flask
    const flaskFormData = new FormData();
    flaskFormData.append('file', file);
    flaskFormData.append('offerId', offerId);

    const flaskResponse = await fetch(`${process.env.FLASK_API_URL || 'http://localhost:5000'}/api/cv/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: flaskFormData,
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return NextResponse.json(
        { message: errorData.message || 'Upload failed' },
        { status: flaskResponse.status }
      );
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
