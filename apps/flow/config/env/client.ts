import { type ClientEnv, parseClientEnv } from './schema';

export const clientEnv: ClientEnv = parseClientEnv(process.env);
