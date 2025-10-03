/**
 * 共通の型定義
 * すべてのストアで使用される型を定義します
 */

/**
 * メッセージの型定義
 */
export interface Message {
  /** メッセージの一意識別子 */
  id: string;
  /** メッセージの内容 */
  content: string;
  /** メッセージの送信者の役割 */
  role: "user" | "assistant";
  /** メッセージが送信された日時 */
  timestamp: Date;
  /** 画像URLの配列（オプション） */
  images?: string[];
}

/**
 * 会話の種類
 */
export type ConversationType = "workflow" | "chatflow";

/**
 * 会話の型定義
 */
export interface Conversation {
  /** 会話の一意識別子 */
  id: string;
  /** 会話の種類（ワークフローまたはチャットフロー） */
  type: ConversationType;
  /** 会話のタイトル */
  title: string;
  /** 会話に含まれるメッセージのリスト */
  messages: Message[];
  /** 会話が作成された日時 */
  createdAt: Date;
  /** 会話が最後に更新された日時 */
  updatedAt: Date;
  /** Dify会話ID（チャットフローの場合のみ） */
  conversationId?: string;
}

/**
 * API応答の型定義
 */
export interface ApiResponse {
  /** エラーメッセージ（エラーが発生した場合） */
  error?: string;
  /** その他のデータ */
  [key: string]: unknown;
}

/**
 * ローディング状態の型定義
 */
export interface LoadingState {
  /** ローディング中かどうか */
  isLoading: boolean;
  /** エラーメッセージ（エラーが発生した場合） */
  error: string | null;
}
