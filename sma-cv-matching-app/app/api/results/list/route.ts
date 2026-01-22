import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const offerId = request.nextUrl.searchParams.get('offerId');

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!offerId) {
      return NextResponse.json(
        { message: 'OfferId requis' },
        { status: 400 }
      );
    }

    const flaskResponse = await fetch(
      `${process.env.FLASK_API_URL || 'http://localhost:5000'}/api/results/list?offerId=${offerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!flaskResponse.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch results' },
        { status: flaskResponse.status }
      );
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Results error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
