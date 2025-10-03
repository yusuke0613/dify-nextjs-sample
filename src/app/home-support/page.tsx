"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HomeSupportWorkflow from "@/components/HomeSupportWorkflow";
import { Loader2 } from "lucide-react";

function HomeSupportContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") || undefined;

  return <HomeSupportWorkflow conversationId={conversationId} />;
}

export default function HomeSupportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <HomeSupportContent />
    </Suspense>
  );
}
