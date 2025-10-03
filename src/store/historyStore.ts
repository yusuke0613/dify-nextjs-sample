/**
 * 履歴管理用のZustandストア
 * 会話履歴の保存、取得、削除を管理します
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Conversation, ConversationType } from "./types";

/**
 * 履歴ストアの状態インターフェース
 */
interface HistoryState {
  /** すべての会話のリスト */
  conversations: Conversation[];
}

/**
 * 履歴ストアのアクションインターフェース
 */
interface HistoryActions {
  /** 会話を保存または更新 */
  saveConversation: (conversation: Conversation) => void;
  /** IDで会話を取得 */
  getConversation: (id: string) => Conversation | null;
  /** すべての会話を取得 */
  getAllConversations: () => Conversation[];
  /** タイプ別に会話を取得 */
  getConversationsByType: (type: ConversationType) => Conversation[];
  /** 最近の会話を取得 */
  getRecentConversations: (limit?: number) => Conversation[];
  /** 会話を削除 */
  deleteConversation: (id: string) => void;
  /** 新しい会話を作成 */
  createConversation: (type: ConversationType, title?: string) => Conversation;
}

/**
 * 新しい会話オブジェクトを作成するヘルパー関数
 */
const createNewConversation = (
  type: ConversationType,
  title?: string
): Conversation => {
  const now = new Date();
  return {
    id: `${type}-${now.getTime()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    title: title || `新しい${type === "workflow" ? "ワークフロー" : "チャット"}`,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * 履歴管理用のストア
 * LocalStorageに永続化されます
 */
export const useHistoryStore = create<HistoryState & HistoryActions>()(
  persist(
    (set, get) => ({
      // 初期状態
      conversations: [],

      // 会話を保存または更新
      saveConversation: (conversation) =>
        set((state) => {
          const existingIndex = state.conversations.findIndex(
            (c) => c.id === conversation.id
          );

          if (existingIndex >= 0) {
            // 既存の会話を更新
            const updatedConversations = [...state.conversations];
            updatedConversations[existingIndex] = {
              ...conversation,
              updatedAt: new Date(),
            };
            return { conversations: updatedConversations };
          } else {
            // 新しい会話を追加
            return {
              conversations: [...state.conversations, conversation],
            };
          }
        }),

      // IDで会話を取得
      getConversation: (id) => {
        return get().conversations.find((c) => c.id === id) || null;
      },

      // すべての会話を取得
      getAllConversations: () => {
        return get().conversations;
      },

      // タイプ別に会話を取得
      getConversationsByType: (type) => {
        return get().conversations.filter((c) => c.type === type);
      },

      // 最近の会話を取得（デフォルト10件）
      getRecentConversations: (limit = 10) => {
        return get()
          .conversations.sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
          )
          .slice(0, limit);
      },

      // 会話を削除
      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
        })),

      // 新しい会話を作成
      createConversation: (type, title) => {
        return createNewConversation(type, title);
      },
    }),
    {
      name: "dify-history-storage", // LocalStorageのキー名
      storage: createJSONStorage(() => localStorage),
      // 日付の復元処理
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    }
  )
);
