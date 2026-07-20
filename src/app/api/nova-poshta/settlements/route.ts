import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEW_POST_API_KEY;
  const search = request.nextUrl.searchParams.get('search')?.trim() ?? '';

  if (!apiKey) {
    return NextResponse.json(
      { message: 'NEW_POST_API_KEY is not configured' },
      { status: 500 },
    );
  }

  if (search.length < 2) {
    return NextResponse.json({
      success: true,
      data: [{ Addresses: [] }],
    });
  }

  const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: search,
      },
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
