/**
 * The SME document library (F4.2.4 AC3, F4.3.2 AC3).
 *
 * An index over documents that already have a home elsewhere, from two API
 * sources that describe two different kinds of object:
 *
 *   LevyTransferDocumentResponseDto   GET /levy-exchange/transfers/:id/document
 *     id, transferId, pdfJobId, status (pending | ready | signed),
 *     downloadUrl?, downloadExpiresAt?
 *     One per transfer, with a lifecycle: generated, then signed. No title
 *     and no date of its own — what it is and when come from the transfer.
 *
 *   LearnerDocumentItemDto            profile.documents on
 *                                     GET /learners/:enrolmentId/profile
 *     id, type (commitment | review | evidence), title, documentAt,
 *     storageKey, externalUrl, downloadUrl?, downloadExpiresAt?
 *     Many per enrolment, each a finished record: titled, dated, typed. No
 *     status; it is listed because it is already signed, completed or accepted.
 *
 * In common: an id and a presigned download link. Not the owner (a transfer vs
 * an apprentice's enrolment), not the lifecycle, not how it is named. One
 * table over both would have to invent a title and a date for the agreement
 * and a status for the learner documents, and would imply they are the same
 * kind of thing — so the library groups them instead.
 */
export const DOCUMENT_PATHS = Object.freeze({
  learnerProfile: (enrolmentId) => `/api/v1/learners/${enrolmentId}/profile`,
});

/** `LearnerDocumentType` on the API. The same labels the employer portal uses. */
export const LEARNER_DOCUMENT_TYPE_LABELS = Object.freeze({
  commitment: "Commitment statement",
  review: "Review",
  evidence: "Evidence",
});
