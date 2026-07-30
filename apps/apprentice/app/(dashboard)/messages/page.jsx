import { MessageCircle } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { MessagesView } from "@/features/messaging/components/MessagesView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Messages",
  description: "Message your tutor and line manager.",
  path: "/messages",
  noIndex: true,
});

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={MessageCircle}
        eyebrow="Communication"
        title="Messages"
        description="Message your tutor and line manager directly."
      />
      <MessagesView />
    </div>
  );
}
