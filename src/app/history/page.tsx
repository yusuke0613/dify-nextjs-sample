"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Workflow, MessageSquare, Trash2, Clock, Headphones, BookOpen, ClipboardList, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAllConversations, deleteConversation, Conversation, CategoryType } from "@/lib/history";

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | "all">("all");

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const all = getAllConversations();
    setConversations(all.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  };

  const handleDelete = (id: string) => {
    deleteConversation(id);
    loadConversations();
  };

  const filteredConversations = conversations.filter((conv) => {
    if (categoryFilter === "all") return true;
    return conv.category === categoryFilter;
  });

  const getCategoryInfo = (category?: CategoryType) => {
    switch (category) {
      case "support":
        return { label: "家電サポート", icon: Headphones, gradient: "from-blue-500 to-cyan-500", bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50" };
      case "knowledge":
        return { label: "ナレッジ問い合わせ", icon: BookOpen, gradient: "from-purple-500 to-pink-500", bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50" };
      case "hearing":
        return { label: "ヒアリング提案", icon: ClipboardList, gradient: "from-emerald-500 to-teal-500", bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50" };
      default:
        return { label: "その他", icon: MessageSquare, gradient: "from-slate-500 to-slate-600", bgGradient: "from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/50" };
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8" />
            相談履歴
          </h1>
          <p className="text-muted-foreground">
            カテゴリ別に過去の相談履歴を確認できます
          </p>
        </div>

        {/* カテゴリフィルター */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">カテゴリで絞り込み</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              onClick={() => setCategoryFilter("all")}
              size="sm"
              className="gap-2"
            >
              すべて ({conversations.length})
            </Button>
            <Button
              variant={categoryFilter === "support" ? "default" : "outline"}
              onClick={() => setCategoryFilter("support")}
              size="sm"
              className={categoryFilter === "support" ? "bg-gradient-to-r from-blue-500 to-cyan-500 gap-2" : "gap-2"}
            >
              <Headphones className="w-4 h-4" />
              家電サポート ({conversations.filter((c) => c.category === "support").length})
            </Button>
            <Button
              variant={categoryFilter === "knowledge" ? "default" : "outline"}
              onClick={() => setCategoryFilter("knowledge")}
              size="sm"
              className={categoryFilter === "knowledge" ? "bg-gradient-to-r from-purple-500 to-pink-500 gap-2" : "gap-2"}
            >
              <BookOpen className="w-4 h-4" />
              ナレッジ問い合わせ ({conversations.filter((c) => c.category === "knowledge").length})
            </Button>
            <Button
              variant={categoryFilter === "hearing" ? "default" : "outline"}
              onClick={() => setCategoryFilter("hearing")}
              size="sm"
              className={categoryFilter === "hearing" ? "bg-gradient-to-r from-emerald-500 to-teal-500 gap-2" : "gap-2"}
            >
              <ClipboardList className="w-4 h-4" />
              ヒアリング提案 ({conversations.filter((c) => c.category === "hearing").length})
            </Button>
          </div>
        </div>

        {/* 会話リスト */}
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                {categoryFilter === "all" ? "履歴がありません" : `${getCategoryInfo(categoryFilter as CategoryType).label}の履歴がありません`}
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link href="/chatflow?category=support">
                  <Button variant="outline" className="gap-2">
                    <Headphones className="w-4 h-4" />
                    家電サポート
                  </Button>
                </Link>
                <Link href="/workflow?category=knowledge">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    ナレッジ検索
                  </Button>
                </Link>
                <Link href="/chatflow?category=hearing">
                  <Button variant="outline" className="gap-2">
                    <ClipboardList className="w-4 h-4" />
                    ヒアリング提案
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conv) => {
              const categoryInfo = getCategoryInfo(conv.category);
              const CategoryIcon = categoryInfo.icon;

              return (
                <Card key={conv.id} className={`hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br ${categoryInfo.bgGradient}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r ${categoryInfo.gradient} shadow-lg flex-shrink-0`}>
                          <CategoryIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <CardTitle className="text-xl truncate">{conv.title}</CardTitle>
                            <Badge className={`bg-gradient-to-r ${categoryInfo.gradient} text-white border-0`}>
                              {categoryInfo.label}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {conv.messages.length} メッセージ
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(conv.updatedAt).toLocaleString("ja-JP", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/${conv.type}?id=${conv.id}&category=${conv.category || "other"}`}>
                          <Button variant="default" size="sm" className={`bg-gradient-to-r ${categoryInfo.gradient} hover:opacity-90`}>
                            開く
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>相談履歴を削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                この操作は取り消せません。相談履歴が完全に削除されます。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(conv.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                削除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  {conv.messages.length > 0 && (
                    <CardContent>
                      <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-white/20">
                        <p className="text-xs text-muted-foreground mb-1">最後のメッセージ</p>
                        <p className="text-sm line-clamp-2">
                          {conv.messages[conv.messages.length - 1].content}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
