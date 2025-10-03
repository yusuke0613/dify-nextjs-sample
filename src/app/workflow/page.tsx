"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WorkflowBlocking from "@/components/WorkflowBlocking";
import { Loader2 } from "lucide-react";

function WorkflowContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") || undefined;

  return <WorkflowBlocking conversationId={conversationId} />;
}

export default function WorkflowPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <WorkflowContent />
    </Suspense>
  );
}
