import { NextRequest, NextResponse } from 'next/server';

// ユーザーリスト（実際の運用では環境変数やデータベースから取得）
const users = [
  {
    agencyCode: '001',
    crewCode: 'CREW001',
    password: 'password123',
  },
  {
    agencyCode: '002',
    crewCode: 'CREW002',
    password: 'password456',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agencyCode, crewCode, password } = body;

    if (!agencyCode || !crewCode || !password) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }

    // ユーザー認証
    const user = users.find(
      (u) =>
        u.agencyCode === agencyCode &&
        u.crewCode === crewCode &&
        u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: '認証情報が正しくありません' },
        { status: 401 }
      );
    }

    // ベーシック認証用のトークンを生成
    const basicAuth = Buffer.from(`${agencyCode}:${crewCode}:${password}`).toString('base64');

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // クッキーにトークンを保存
    response.cookies.set('auth-token', basicAuth, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24時間
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'ログイン処理に失敗しました' },
      { status: 500 }
    );
  }
}
