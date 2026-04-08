export type UserRole =
    | 'employer_admin'
    | 'employer_ld_manager'
    | 'employer_line_manager'
    | 'employer_finance'
    | 'provider_admin'
    | 'provider_programme_manager'
    | 'provider_tutor'
    | 'provider_compliance'
    | 'apprentice'
    | 'flow_admin'
    | 'sme_owner'
    | 'levy_donor';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    organisationId: string;
    portalId: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}