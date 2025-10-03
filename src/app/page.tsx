"use client";

import Link from "next/link";
import { Headphones, BookOpen, ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* iPad横持ち用3ペインレイアウト */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:p-6 lg:h-screen">
        {/* 左ペイン: 家電サポート */}
        <Link href="/chatflow?category=support" className="group">
          <Card className="flex flex-col h-full bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-900">
                    家電サポート
                  </CardTitle>
                  <CardDescription className="text-base text-slate-500">
                    困りごと解決
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-slate-600 leading-relaxed">
                家電の使い方やトラブルを
                <br />
                即座に解決します
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-700">24時間対応</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-700">
                    トラブルシューティング
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-700">操作ガイダンス</span>
                </div>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm mt-6"
                size="lg"
              >
                開始する
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* 中央ペイン: 家電ナレッジ問い合わせ */}
        <Link href="/workflow?category=knowledge" className="group">
          <Card className="flex flex-col h-full bg-white border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-900">
                    ナレッジ検索
                  </CardTitle>
                  <CardDescription className="text-base text-slate-500">
                    製品情報・知識
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-slate-600 leading-relaxed">
                豊富な製品知識から
                <br />
                最適な情報を提供します
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-700">製品情報検索</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-700">
                    メンテナンス方法
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-700">よくある質問</span>
                </div>
              </div>

              <Button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm mt-6"
                size="lg"
              >
                開始する
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* モバイル・タブレット縦持ち用レイアウト */}
      <div className="lg:hidden container mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            クルーエージェント
          </h1>
          <p className="text-base text-slate-600">ご用件をお選びください</p>
        </div>

        {/* カテゴリメニュー */}
        <div className="grid grid-cols-1 gap-4">
          <Link href="/chatflow?category=support">
            <Card className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm flex-shrink-0">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    家電サポート
                  </h3>
                  <p className="text-sm text-slate-600">使い方・トラブル解決</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/workflow?category=knowledge">
            <Card className="bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-16 h-16 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    ナレッジ検索
                  </h3>
                  <p className="text-sm text-slate-600">
                    製品情報・お手入れ方法
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
