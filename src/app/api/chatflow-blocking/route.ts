import { NextRequest, NextResponse } from "next/server";
import https from "https";

const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_URL = process.env.DIFY_API_URL || "";
const ENDPOINT = DIFY_API_URL.endsWith("/v1")
  ? `${DIFY_API_URL}/chat-messages`
  : `${DIFY_API_URL}/v1/chat-messages`;

// SSL証明書検証をスキップするエージェント（開発環境のみ）
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function POST(request: NextRequest) {
  try {
    const { query, conversationId } = await request.json();

    console.log("Chatflow blocking request:", {
      endpoint: ENDPOINT,
      query,
      conversationId,
    });

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: query,
        response_mode: "blocking",
        conversation_id: conversationId || "",
        user: "user-" + Date.now(),
      }),
      // @ts-ignore - Node.js fetch accepts agent
      agent: ENDPOINT.startsWith("https:") ? httpsAgent : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dify chatflow API error:", errorText);
      return NextResponse.json(
        { error: `Dify API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Chatflow API response:", data);

    return NextResponse.json({
      answer: data.answer || "",
      conversationId: data.conversation_id || "",
      messageId: data.message_id || "",
    });
  } catch (error) {
    console.error("Chatflow blocking API error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
