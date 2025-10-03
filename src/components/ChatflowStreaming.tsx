"use client";

/**
 * チャットフローストリーミングコンポーネント
 * Zustandで状態管理を最適化したバージョン
 */

import React, { useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Save, Mic, Image as ImageIcon, X } from "lucide-react";
import {
  useChatflowStore,
  useHistoryStore,
  createMessage,
  formatTime,
  Message,
} from "@/store";

// ============================================================================
// 定数
// ============================================================================

const MAX_INPUT_LENGTH = 2000;

const ROLE_STYLES = {
  user: {
    container: "flex-row-reverse space-x-reverse",
    avatar: "bg-slate-900",
    card: "bg-slate-900 text-white ml-auto shadow-sm",
    time: "text-white/60",
  },
  assistant: {
    container: "",
    avatar: "bg-blue-500",
    card: "bg-white border border-slate-200 shadow-sm",
    time: "text-slate-500",
  },
} as const;

// ============================================================================
// カスタムフック
// ============================================================================

/**
 * スクロールを最下部に自動調整するフック
 */
const useAutoScroll = (
  scrollAreaRef: React.RefObject<HTMLDivElement>,
  dependencies: unknown[]
) => {
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

/**
 * 会話をロードするフック
 */
const useLoadConversation = (conversationId?: string) => {
  const { getConversation } = useHistoryStore();
  const { loadConversation } = useChatflowStore();

  useEffect(() => {
    if (conversationId) {
      const conversation = getConversation(conversationId);
      if (conversation && conversation.type === "chatflow") {
        loadConversation(conversation);
      }
    }
  }, [conversationId, getConversation, loadConversation]);
};

// ============================================================================
// コンポーネント
// ============================================================================

interface ChatflowStreamingProps {
  conversationId?: string;
}

export default function ChatflowStreaming({
  conversationId,
}: ChatflowStreamingProps) {
  // ストアから状態とアクションを取得
  const {
    messages,
    inputValue,
    isLoading,
    error,
    difyConversationId,
    currentConversation,
    isSaving,
    addMessage,
    updateMessage,
    setInputValue,
    setIsLoading,
    setError,
    setDifyConversationId,
    setCurrentConversation,
    setIsSaving,
  } = useChatflowStore();

  const { saveConversation, createConversation } = useHistoryStore();

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // ローカルステート
  const [isRecording, setIsRecording] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);

  // カスタムフック
  useAutoScroll(scrollAreaRef, [messages]);
  useLoadConversation(conversationId);

  // ============================================================================
  // イベントハンドラー
  // ============================================================================

  /**
   * 会話を保存
   */
  const handleSaveConversation = useCallback(() => {
    setIsSaving(true);
    try {
      const conversation =
        currentConversation || createConversation("chatflow", "チャットフロー会話");

      const updatedConversation = {
        ...conversation,
        messages: messages,
        conversationId: difyConversationId,
        updatedAt: new Date(),
      };

      saveConversation(updatedConversation);
      setCurrentConversation(updatedConversation);
    } finally {
      setIsSaving(false);
    }
  }, [
    messages,
    difyConversationId,
    currentConversation,
    createConversation,
    saveConversation,
    setCurrentConversation,
    setIsSaving,
  ]);

  /**
   * 画像選択処理
   */
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  }, []);

  /**
   * 画像削除処理
   */
  const handleImageRemove = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * 音声録音開始
   */
  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        // 音声をテキストに変換（Whisper APIなど）
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const { text } = await response.json();
            setInputValue(prev => prev + text);
          }
        } catch (err) {
          console.error("Speech to text error:", err);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      setError("マイクへのアクセスが拒否されました");
    }
  }, [setInputValue, setError]);

  /**
   * 音声録音停止
   */
  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  /**
   * メッセージを送信
   */
  const handleSendMessage = useCallback(async () => {
    if ((!inputValue.trim() && selectedImages.length === 0) || isLoading) return;

    const userMessage = createMessage(inputValue, "user");
    const currentInput = inputValue;
    const currentImages = selectedImages;

    // ユーザーメッセージを追加
    addMessage(userMessage);
    setInputValue("");
    setSelectedImages([]);
    setIsLoading(true);
    setError(null);

    try {
      // FormDataで画像とテキストを送信
      const formData = new FormData();
      formData.append("query", currentInput);
      if (difyConversationId) {
        formData.append("conversationId", difyConversationId);
      }

      currentImages.forEach((image, index) => {
        formData.append(`files`, image);
      });

      // API呼び出し
      const response = await fetch("/api/chatflow-streaming", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // ストリーミングレスポンスの処理
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let accumulatedImages: string[] = [];

      if (!reader) {
        throw new Error("No response body");
      }

      // アシスタントメッセージの初期化
      const assistantMessage = createMessage("", "assistant");
      addMessage(assistantMessage);

      // ストリーミングデータの読み込み
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              console.log("Chatflow response:", parsed);

              // Workflowの場合はworkflow_finishedイベントで結果を取得
              if (parsed.event === "workflow_finished") {
                const outputs = parsed.data?.outputs;
                if (outputs) {
                  // outputsからテキストを取得（フィールド名はワークフローによって異なる）
                  accumulatedText = outputs.text || outputs.result || outputs.answer || JSON.stringify(outputs);
                }
              }

              // node_finishedイベントでも中間結果を取得可能
              if (parsed.event === "node_finished") {
                const outputs = parsed.data?.outputs;
                if (outputs) {
                  accumulatedText = outputs.text || outputs.result || outputs.answer || accumulatedText;
                }
              }

              // Chat Assistantの場合のイベント
              if (parsed.event === "message" || parsed.event === "agent_message") {
                accumulatedText = parsed.answer || "";

                // 画像データの抽出（Difyのレスポンスに含まれる可能性がある）
                if (parsed.files && Array.isArray(parsed.files)) {
                  accumulatedImages = parsed.files
                    .filter((file: any) => file.type === "image")
                    .map((file: any) => file.url);
                }
              }

              // メッセージを更新
              if (accumulatedText) {
                updateMessage(
                  assistantMessage.id,
                  accumulatedText,
                  accumulatedImages.length > 0 ? accumulatedImages : undefined
                );
              }

              // 会話IDの保存
              if (parsed.conversation_id && !difyConversationId) {
                setDifyConversationId(parsed.conversation_id);
              }
            } catch (e) {
              console.error("JSON parse error:", e);
            }
          }
        }
      }
    } catch (err) {
      // エラーメッセージを追加
      const errorMessage = createMessage(
        "申し訳ございません。エラーが発生しました。もう一度お試しください。",
        "assistant"
      );
      addMessage(errorMessage);
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    inputValue,
    selectedImages,
    isLoading,
    difyConversationId,
    addMessage,
    updateMessage,
    setInputValue,
    setIsLoading,
    setError,
    setDifyConversationId,
  ]);

  /**
   * キーボードイベント処理
   */
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  /**
   * 入力値変更処理
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length <= MAX_INPUT_LENGTH) {
        setInputValue(value);
      }
    },
    [setInputValue]
  );

  // ============================================================================
  // レンダリングヘルパー
  // ============================================================================

  /**
   * メッセージアイテムをレンダリング
   */
  const renderMessageItem = (message: Message) => {
    const styles = ROLE_STYLES[message.role];
    const Icon = message.role === "user" ? User : Bot;

    return (
      <div
        key={message.id}
        className={`flex items-start gap-3 ${styles.container}`}
      >
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.avatar}`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div
          className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}
        >
          <Card className={`inline-block max-w-[85%] p-4 ${styles.card}`}>
            {/* 画像がある場合は表示 */}
            {message.images && message.images.length > 0 && (
              <div className="mb-3 space-y-2">
                {message.images.map((imageUrl, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`画像 ${index + 1}`}
                      className="max-w-full h-auto rounded-lg"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* テキストメッセージ */}
            {message.content && (
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            <div className={`text-xs mt-2 ${styles.time}`}>
              {formatTime(message.timestamp)}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  /**
   * ローディングインジケーターをレンダリング
   */
  const renderLoadingIndicator = () => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <Card className="inline-block p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-base text-slate-600">入力中...</span>
          </div>
        </Card>
      </div>
    </div>
  );

  // ============================================================================
  // レンダリング
  // ============================================================================

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="flex-shrink-0 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                サポートアシスタント
              </h1>
              <p className="text-sm text-slate-500">
                {isLoading ? "入力中..." : "オンライン"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">
              {messages.length} メッセージ
            </div>
            <Button
              onClick={handleSaveConversation}
              disabled={isSaving || messages.length <= 1}
              size="sm"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="ml-2">保存</span>
            </Button>
          </div>
        </div>
        {error && (
          <div className="px-6 pb-3">
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              エラー: {error}
            </div>
          </div>
        )}
      </header>

      {/* メッセージエリア */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
            {messages.map(renderMessageItem)}
            {isLoading && renderLoadingIndicator()}
          </div>
        </ScrollArea>
      </main>

      {/* 入力エリア */}
      <footer className="flex-shrink-0 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* 選択された画像のプレビュー */}
          {selectedImages.length > 0 && (
            <div className="mb-3 flex gap-2 flex-wrap">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`選択画像 ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                  />
                  <button
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex gap-2">
              {/* 画像選択ボタン */}
              <Button
                type="button"
                variant="outline"
                size="default"
                className="h-[52px] px-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                aria-label="画像を選択"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />

              {/* 音声録音ボタン */}
              <Button
                type="button"
                variant="outline"
                size="default"
                className={`h-[52px] px-4 ${isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isLoading}
                aria-label={isRecording ? "録音停止" : "録音開始"}
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="メッセージを入力してください..."
                className="min-h-[52px] text-base bg-white border-slate-300 focus:border-blue-400 focus:ring-blue-100"
                disabled={isLoading}
                aria-label="メッセージ入力"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && selectedImages.length === 0) || isLoading}
              size="default"
              className="h-[52px] px-6 bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all duration-150"
              aria-label="メッセージ送信"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
            <span>Enterで送信 {isRecording && "• 録音中..."}</span>
            <span>
              {inputValue.length}/{MAX_INPUT_LENGTH}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
