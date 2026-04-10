/**
 * Global auth types used across all Gradlly portals.
 * Any type that relates to authentication, sessions, or identity
 * and is needed in more than one portal belongs here.
 */
export enum UserRole {
  EMPLOYER_ADMIN = "employer_admin",
  L_AND_D_MANAGER = "l_and_d_manager",
  LINE_MANAGER = "line_manager",
  FINANCE_DIRECTOR = "finance_director",
  PROVIDER_ADMIN = "provider_admin",
  PROGRAMME_MANAGER = "programme_manager",
  TUTOR = "tutor",
  COMPLIANCE_OFFICER = "compliance_officer",
  QUALITY_MANAGER = "quality_manager",
  APPRENTICE = "apprentice",
  SME_OWNER = "sme_owner",
  LEVY_DONOR = "levy_donor",
  GRADLLY_ADMIN = "gradlly_admin",
}

export enum Portal {
  EMPLOYER = "employer",
  PROVIDER = "provider",
  APPRENTICE = "apprentice",
  FLOW = "flow",
  MAIN = "main",
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  portal: Portal;
  organisationId: string;
  organisationName: string;
  avatarUrl?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface AuthSession {
  sessionId: string;
  device: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
  requiresMFA: boolean;
}

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organisationName: string;
  portal: Portal;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface MFASetupResponse {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface MFAVerifyPayload {
  code: string;
  sessionToken?: string;
}

export interface OAuthCallbackPayload {
  code: string;
  state: string;
}

export enum PasswordStrength {
  WEAK = "weak",
  FAIR = "fair",
  STRONG = "strong",
  VERY_STRONG = "very_strong",
}
