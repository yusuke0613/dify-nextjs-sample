"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatflowStreaming from "@/components/ChatflowStreaming";
import { Loader2 } from "lucide-react";

function ChatflowContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") || undefined;

  return <ChatflowStreaming conversationId={conversationId} />;
}

export default function ChatflowPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ChatflowContent />
    </Suspense>
  );
}
