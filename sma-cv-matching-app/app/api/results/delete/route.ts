import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const cvId = request.nextUrl.searchParams.get('cvId');

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!cvId) {
      return NextResponse.json(
        { message: 'cvId requis' },
        { status: 400 }
      );
    }

    const flaskResponse = await fetch(
      `${process.env.FLASK_API_URL || 'http://localhost:5000'}/api/results/delete?cvId=${cvId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to delete' },
        { status: flaskResponse.status }
      );
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
