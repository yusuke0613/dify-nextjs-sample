import { NextRequest } from "next/server";
import https from "https";

const DIFY_API_KEY = process.env.DIFY_KNOWLEDGE_SEARCH_API_KEY;
const DIFY_API_URL = process.env.DIFY_API_URL || "";
const ENDPOINT = DIFY_API_URL.endsWith("/v1")
  ? `${DIFY_API_URL}/workflows/run`
  : `${DIFY_API_URL}/v1/workflows/run`;

// SSL証明書検証をスキップするエージェント（開発環境のみ）
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function POST(request: NextRequest) {
  try {
    const { query, conversationId } = await request.json();

    console.log("Knowledge search workflow request:", {
      endpoint: ENDPOINT,
      query,
      conversationId,
    });

    // Difyへ転送（ワークフローはストリーミング対応）
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: { query: query },
        response_mode: "streaming",
        user: "user-" + Date.now(),
      }),
      // @ts-ignore - Node.js fetch accepts agent
      agent: ENDPOINT.startsWith("https:") ? httpsAgent : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dify knowledge search workflow API error:", errorText);
      return new Response(
        JSON.stringify({
          error: `Dify API Error: ${response.status}`,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ストリーミングレスポンスをそのまま返す
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Knowledge search workflow API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
