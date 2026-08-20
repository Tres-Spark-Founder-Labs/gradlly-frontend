/**
 * F3.4.1 Commitment Statement Signing — paths and vocabulary.
 *
 * Mirrors `apps/provider/features/esignature/constants` and
 * `apps/employer/features/commitments/constants` rather than inventing a third
 * shape. The endpoints are the same ones the other two portals already call;
 * only the party differs.
 */

export const COMMITMENT_PATHS = Object.freeze({
  list: "/api/v1/commitment-statements",
  byId: (id) => `/api/v1/commitment-statements/${id}`,
  sign: (id) => `/api/v1/commitment-statements/${id}/sign`,
  signedDocument: (id) => `/api/v1/commitment-statements/${id}/signed-document`,
});

/**
 * `TripartiteParty` on the API. The apprentice only ever signs as itself, but
 * the value is sent explicitly because `SignCommitmentDto.party` is required
 * and the server checks it against the signature row it resolves for the user.
 */
export const TRIPARTITE_PARTY = Object.freeze({
  APPRENTICE: "apprentice",
  TUTOR: "tutor",
  EMPLOYER_MANAGER: "employer_manager",
});

/** `CommitmentStatementStatus` on the API. */
export const COMMITMENT_STATUS = Object.freeze({
  DRAFT: "draft",
  AWAITING_SIGNATURES: "awaiting_signatures",
  SIGNED: "signed",
  CANCELLED: "cancelled",
});

/** `CommitmentSignatureStatus` on the API. */
export const SIGNATURE_STATUS = Object.freeze({
  PENDING: "pending",
  SIGNED: "signed",
});

/**
 * The signature image is uploaded before signing, because
 * `SignCommitmentDto.signatureImageKey` is required — the API takes a storage
 * key, never the image itself. Both capture modes therefore end at a PNG:
 * the drawn pad exports its canvas, and the typed name is rasterised to one.
 */
export const SIGNATURE_UPLOAD_CATEGORY = "signature";
