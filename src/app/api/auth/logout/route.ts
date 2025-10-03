import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // クッキーを削除
  response.cookies.delete('auth-token');

  return response;
}
