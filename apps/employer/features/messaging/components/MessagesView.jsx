"use client";

import { useState } from "react";

import { Card } from "@/components/ui/Card";

import { MessageThreadList } from "./MessageThreadList";
import { MessageThreadView } from "./MessageThreadView";

export function MessagesView() {
  const [activeThread, setActiveThread] = useState(null);

  return (
    <Card className="overflow-hidden p-0">
      <div
        className="grid grid-cols-1 md:grid-cols-[280px_1fr]"
        style={{ height: 560 }}
      >
        <div className="overflow-y-auto border-b border-neutral-100 md:border-b-0 md:border-r">
          <MessageThreadList
            activeThreadId={activeThread?.id}
            onSelectThread={setActiveThread}
          />
        </div>
        <MessageThreadView thread={activeThread} />
      </div>
    </Card>
  );
}
