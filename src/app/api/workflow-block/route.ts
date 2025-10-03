import { NextRequest, NextResponse } from "next/server";
import https from "https";

//環境変数設定
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_URL = process.env.DIFY_API_URL || "";
// DIFY_API_URLに既に/v1が含まれている場合は追加しない
const ENDPOINT = DIFY_API_URL.endsWith("/v1")
  ? `${DIFY_API_URL}/workflows/run`
  : `${DIFY_API_URL}/v1/workflows/run`;

// SSL証明書検証をスキップするエージェント（開発環境のみ）
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    console.log("Request to Dify API:", {
      endpoint: ENDPOINT,
      query,
    });

    // SSL証明書の検証をスキップ（開発環境のみ）
    const fetchOptions: RequestInit & { agent?: https.Agent } = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: { query: query },
        response_mode: "blocking",
        user: "1234567890",
      }),
    };

    const response = await fetch(ENDPOINT, {
      ...fetchOptions,
      // @ts-ignore - Node.js fetch accepts agent
      agent: ENDPOINT.startsWith("https:") ? httpsAgent : undefined,
    });

    console.log("Dify API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dify API error:", errorText);
      return NextResponse.json(
        { error: `Dify API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Dify API response data:", data);

    // レスポンス構造を確認してから適切にアクセス
    const outputText =
      data.data?.outputs?.result ||
      data.data?.outputs?.text ||
      JSON.stringify(data);

    // 画像データの抽出
    let images: string[] = [];
    if (data.data?.outputs?.files && Array.isArray(data.data.outputs.files)) {
      images = data.data.outputs.files
        .filter((file: any) => file.type === "image")
        .map((file: any) => file.url);
    }

    return NextResponse.json({
      text: outputText,
      images: images.length > 0 ? images : undefined,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
