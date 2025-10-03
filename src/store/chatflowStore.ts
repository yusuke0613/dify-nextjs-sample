/**
 * チャットフロー用のZustandストア
 * チャットフローの状態、メッセージ管理、API通信を管理します
 */

import { create } from "zustand";
import { Message, Conversation } from "./types";
import { createMessage } from "./utils";

/**
 * チャットフローストアの状態インターフェース
 */
interface ChatflowState {
  /** メッセージのリスト */
  messages: Message[];
  /** 入力値 */
  inputValue: string;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** Dify会話ID */
  difyConversationId: string;
  /** 現在の会話 */
  currentConversation: Conversation | null;
  /** 保存中フラグ */
  isSaving: boolean;
}

/**
 * チャットフローストアのアクションインターフェース
 */
interface ChatflowActions {
  /** メッセージを追加 */
  addMessage: (message: Message) => void;
  /** メッセージを更新 */
  updateMessage: (id: string, content: string, images?: string[]) => void;
  /** 入力値を設定 */
  setInputValue: (value: string) => void;
  /** ローディング状態を設定 */
  setIsLoading: (loading: boolean) => void;
  /** エラーを設定 */
  setError: (error: string | null) => void;
  /** Dify会話IDを設定 */
  setDifyConversationId: (id: string) => void;
  /** 現在の会話を設定 */
  setCurrentConversation: (conversation: Conversation | null) => void;
  /** 保存中フラグを設定 */
  setIsSaving: (saving: boolean) => void;
  /** 会話をロード */
  loadConversation: (conversation: Conversation) => void;
  /** メッセージをクリア */
  clearMessages: () => void;
  /** ストアをリセット */
  reset: () => void;
}

/**
 * 初期メッセージ
 */
const INITIAL_MESSAGE: Message = {
  id: "initial",
  content: "こんにちは！チャットフローへようこそ。何かお手伝いできることはありますか？",
  role: "assistant",
  timestamp: new Date(),
};

/**
 * 初期状態
 */
const initialState: ChatflowState = {
  messages: [INITIAL_MESSAGE],
  inputValue: "",
  isLoading: false,
  error: null,
  difyConversationId: "",
  currentConversation: null,
  isSaving: false,
};

/**
 * チャットフロー用のストア
 */
export const useChatflowStore = create<ChatflowState & ChatflowActions>()(
  (set) => ({
    // 初期状態
    ...initialState,

    // メッセージを追加
    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],
      })),

    // メッセージを更新（ストリーミング用）
    updateMessage: (id, content, images) =>
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, content, ...(images && { images }) } : msg
        ),
      })),

    // 入力値を設定
    setInputValue: (value) =>
      set({
        inputValue: value,
      }),

    // ローディング状態を設定
    setIsLoading: (loading) =>
      set({
        isLoading: loading,
      }),

    // エラーを設定
    setError: (error) =>
      set({
        error,
      }),

    // Dify会話IDを設定
    setDifyConversationId: (id) =>
      set({
        difyConversationId: id,
      }),

    // 現在の会話を設定
    setCurrentConversation: (conversation) =>
      set({
        currentConversation: conversation,
      }),

    // 保存中フラグを設定
    setIsSaving: (saving) =>
      set({
        isSaving: saving,
      }),

    // 会話をロード
    loadConversation: (conversation) =>
      set({
        messages: conversation.messages,
        difyConversationId: conversation.conversationId || "",
        currentConversation: conversation,
      }),

    // メッセージをクリア
    clearMessages: () =>
      set({
        messages: [INITIAL_MESSAGE],
      }),

    // ストアをリセット
    reset: () =>
      set({
        ...initialState,
      }),
  })
);

/**
 * チャットフローAPIを呼び出すカスタムフック
 */
export const useChatflowApi = () => {
  const store = useChatflowStore();

  /**
   * メッセージを送信
   */
  const sendMessage = async (query: string, conversationId?: string) => {
    store.setIsLoading(true);
    store.setError(null);

    try {
      const response = await fetch("/api/chatflow-streaming", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      store.setError(errorMessage);
      throw err;
    } finally {
      store.setIsLoading(false);
    }
  };

  return { sendMessage };
};
