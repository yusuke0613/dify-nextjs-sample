"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Home,
  Workflow,
  MessageSquare,
  History,
  Headphones,
  BookOpen,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "ホーム", icon: Home, path: "/", category: null },
  {
    href: "/chatflow?category=support",
    label: "家電サポート",
    icon: Headphones,
    path: "/chatflow",
    category: "support",
  },
  {
    href: "/workflow?category=knowledge",
    label: "ナレッジ検索",
    icon: BookOpen,
    path: "/workflow",
    category: "knowledge",
  },
  {
    href: "/history",
    label: "履歴",
    icon: History,
    path: "/history",
    category: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:z-50 border-r border-slate-200 bg-slate-50">
      {/* ヘッダー */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-slate-900">
            クルーエージェント
          </span>
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path &&
            (item.category === null || category === item.category);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white hover:text-slate-900"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ログアウトボタン */}
      <div className="px-4 py-6 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150 text-slate-700 hover:bg-white hover:text-slate-900 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-base font-medium">ログアウト</span>
        </button>
      </div>
    </aside>
  );
}
