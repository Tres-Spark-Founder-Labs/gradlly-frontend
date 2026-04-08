export type PortalId = 'employer' | 'provider' | 'apprentice' | 'flow';

export interface PortalConfig {
    id: PortalId;
    name: string;
    domain: string;
    theme: PortalTheme;
}

export interface PortalTheme {
    accent: string;
    accentFg: string;
    headerBg: string;
    sidebarBg: string;
}

export const PORTAL_CONFIGS: Record<PortalId, PortalConfig> = {
    employer: {
        id: 'employer',
        name: 'Employer Portal',
        domain: process.env['NEXT_PUBLIC_EMPLOYER_DOMAIN'] ?? 'employer.gradlly.com',
        theme: {
            accent: '#3b62f6',
            accentFg: '#ffffff',
            headerBg: '#0d1f6e',
            sidebarBg: '#1e3ecc',
        },
    },
    provider: {
        id: 'provider',
        name: 'Provider Portal',
        domain: process.env['NEXT_PUBLIC_PROVIDER_DOMAIN'] ?? 'provider.gradlly.com',
        theme: {
            accent: '#0891b2',
            accentFg: '#ffffff',
            headerBg: '#164e63',
            sidebarBg: '#155e75',
        },
    },
    apprentice: {
        id: 'apprentice',
        name: 'Apprentice Portal',
        domain: process.env['NEXT_PUBLIC_APPRENTICE_DOMAIN'] ?? 'apprentice.gradlly.com',
        theme: {
            accent: '#7c3aed',
            accentFg: '#ffffff',
            headerBg: '#4c1d95',
            sidebarBg: '#5b21b6',
        },
    },
    flow: {
        id: 'flow',
        name: 'FlowPortal',
        domain: process.env['NEXT_PUBLIC_FLOW_DOMAIN'] ?? 'flow.gradlly.com',
        theme: {
            accent: '#059669',
            accentFg: '#ffffff',
            headerBg: '#064e3b',
            sidebarBg: '#065f46',
        },
    },
};