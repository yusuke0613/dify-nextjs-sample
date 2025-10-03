// 履歴管理用の型定義とユーティリティ

export type ConversationType = "workflow" | "chatflow";
export type CategoryType = "support" | "knowledge" | "hearing" | "other";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  category?: CategoryType; // カテゴリを追加
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  conversationId?: string; // Dify conversation ID for chatflow
}

const STORAGE_KEY = "dify_conversations";

// LocalStorageから全ての会話を取得
export function getAllConversations(): Conversation[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const conversations = JSON.parse(stored);
    // Date オブジェクトに変換
    return conversations.map((conv: Conversation) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error("Failed to load conversations:", error);
    return [];
  }
}

// 特定の会話を取得
export function getConversation(id: string): Conversation | null {
  const conversations = getAllConversations();
  return conversations.find((conv) => conv.id === id) || null;
}

// 会話を保存
export function saveConversation(conversation: Conversation): void {
  if (typeof window === "undefined") return;

  try {
    const conversations = getAllConversations();
    const existingIndex = conversations.findIndex((c) => c.id === conversation.id);

    if (existingIndex >= 0) {
      conversations[existingIndex] = {
        ...conversation,
        updatedAt: new Date(),
      };
    } else {
      conversations.push(conversation);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversation:", error);
  }
}

// 会話を削除
export function deleteConversation(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const conversations = getAllConversations();
    const filtered = conversations.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete conversation:", error);
  }
}

// 新しい会話を作成
export function createConversation(
  type: ConversationType,
  title?: string
): Conversation {
  const now = new Date();
  return {
    id: `${type}-${now.getTime()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    title: title || `新しい${type === "workflow" ? "ワークフロー" : "チャット"}`,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

// タイプ別に会話を取得
export function getConversationsByType(
  type: ConversationType
): Conversation[] {
  return getAllConversations().filter((conv) => conv.type === type);
}

// 最近の会話を取得
export function getRecentConversations(limit: number = 10): Conversation[] {
  const conversations = getAllConversations();
  return conversations
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}
