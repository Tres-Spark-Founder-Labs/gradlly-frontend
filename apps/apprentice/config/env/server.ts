import { clientEnv } from './client';
import { type ServerEnv, parseServerEnv } from './schema';

const serverEnvProxy = new Proxy({} as ServerEnv, {
  get() {
    throw new Error('serverEnv cannot be accessed in the browser.');
  },
});

export const serverEnv: ServerEnv =
  typeof window === 'undefined'
    ? {
        ...clientEnv,
        ...parseServerEnv(process.env),
      }
    : serverEnvProxy;
