export const MESSAGING_PATHS = Object.freeze({
  UNREAD_COUNT: "/api/v1/messaging/threads/unread-count",
  THREADS: "/api/v1/messaging/threads",
  thread: (id) => `/api/v1/messaging/threads/${id}`,
  threadRead: (id) => `/api/v1/messaging/threads/${id}/read`,
  messages: (threadId) => `/api/v1/messaging/threads/${threadId}/messages`,
  ATTACHMENT_UPLOAD_URL: "/api/v1/messaging/attachments/upload-url",
});

export const MESSAGE_THREAD_PARTY = Object.freeze({
  TUTOR: "tutor",
  EMPLOYER_MANAGER: "employer_manager",
});

// FlowPortal orgs act as the employer for their own funded apprentices, so
// almost every thread visible here is the "employer_manager" party (owner/admin
// users can also see "tutor" threads across the org — any-thread visibility
// per messaging-access.service.ts's isAdmin bypass).
export const MESSAGE_THREAD_PARTY_LABELS = Object.freeze({
  tutor: "Tutor",
  employer_manager: "Line manager",
});
