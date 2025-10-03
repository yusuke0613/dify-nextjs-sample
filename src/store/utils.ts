/**
 * ストア用のユーティリティ関数
 */

import { Message } from "./types";

/**
 * メッセージIDを生成
 * @returns ユニークなメッセージID
 */
export const generateMessageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * 時刻をフォーマット
 * @param date - フォーマットする日時
 * @returns フォーマットされた時刻文字列
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * メッセージオブジェクトを作成
 * @param content - メッセージの内容
 * @param role - メッセージの送信者の役割
 * @returns 新しいメッセージオブジェクト
 */
export const createMessage = (
  content: string,
  role: "user" | "assistant"
): Message => {
  return {
    id: generateMessageId(),
    content,
    role,
    timestamp: new Date(),
  };
};
