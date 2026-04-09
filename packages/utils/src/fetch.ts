import { clientEnv, serverEnv } from '@gradlly/config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type FetchOptions<TBody> = Omit<RequestInit, 'body' | 'method'> & {
  body?: TBody;
  method?: HttpMethod;
};

const resolveBaseUrl = () =>
  typeof window === 'undefined'
    ? serverEnv.NEXT_PUBLIC_API_BASE_URL
    : clientEnv.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch<TResponse, TBody = undefined>(
  path: string,
  options: FetchOptions<TBody> = {},
): Promise<TResponse> {
  const baseUrl = resolveBaseUrl();
  const { body, headers, method = 'GET', ...rest } = options;

  const requestInit: RequestInit = {
    ...rest,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${path}`, requestInit);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}
