import { type ClientEnv, parseClientEnv } from './schema';

const clientRuntimeEnv = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_EMPLOYER_URL: process.env.NEXT_PUBLIC_EMPLOYER_URL,
  NEXT_PUBLIC_PROVIDER_URL: process.env.NEXT_PUBLIC_PROVIDER_URL,
  NEXT_PUBLIC_APPRENTICE_URL: process.env.NEXT_PUBLIC_APPRENTICE_URL,
  NEXT_PUBLIC_FLOW_URL: process.env.NEXT_PUBLIC_FLOW_URL,
  NEXT_PUBLIC_MAIN_URL: process.env.NEXT_PUBLIC_MAIN_URL,
};

export const clientEnv: ClientEnv = parseClientEnv(clientRuntimeEnv);
