import { parseClientEnv, parseServerEnv, type ServerEnv } from './env';

export const clientEnv = parseClientEnv(process.env);

const serverEnvProxy = new Proxy({} as ServerEnv, {
  get() {
    throw new Error('serverEnv cannot be accessed in the browser.');
  },
});

export const serverEnv =
  typeof window === 'undefined'
    ? { ...clientEnv, ...parseServerEnv(process.env) }
    : serverEnvProxy;

export type { ClientEnv, ServerEnv, ServerOnlyEnv } from './env';
