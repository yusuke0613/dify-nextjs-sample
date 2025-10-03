"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import KnowledgeSearchWorkflow from "@/components/KnowledgeSearchWorkflow";
import { Loader2 } from "lucide-react";

function KnowledgeSearchContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") || undefined;

  return <KnowledgeSearchWorkflow conversationId={conversationId} />;
}

export default function KnowledgeSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <KnowledgeSearchContent />
    </Suspense>
  );
}
