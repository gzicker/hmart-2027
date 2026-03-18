export const VTEX_CONFIG = {
  account: import.meta.env.VITE_VTEX_ACCOUNT || 'hmartusqa',
  proxyBaseUrl: import.meta.env.VITE_VTEX_PROXY_URL || 'https://mute-feather-1655.gustavobzicker.workers.dev',
  salesChannel: import.meta.env.VITE_VTEX_SALES_CHANNEL || '1',
  locale: 'en-US',
  get checkoutUrl() {
    return `https://${this.account}.myvtex.com/checkout`;
  },
};

export class VtexApiError extends Error {
  constructor(message: string, public status: number, public endpoint: string, public responseBody?: unknown) {
    super(message);
    this.name = 'VtexApiError';
  }
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

export async function vtexFetch<T>(path: string, options: {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  timeout?: number;
} = {}): Promise<T> {
  const { method = 'GET', body, params, timeout = 10000 } = options;
  const url = new URL(path, VTEX_CONFIG.proxyBaseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        let responseBody: unknown;
        try { responseBody = await response.json(); } catch { responseBody = await response.text(); }
        const error = new VtexApiError(`VTEX API Error: ${response.status}`, response.status, path, responseBody);

        if (RETRYABLE_STATUSES.has(response.status) && attempt < MAX_RETRIES) {
          lastError = error;
          continue;
        }
        throw error;
      }

      const text = await response.text();
      if (!text) {
        throw new VtexApiError('Empty response body', 204, path);
      }
      return JSON.parse(text) as T;
    } catch (err) {
      if (err instanceof VtexApiError) throw err;
      lastError = err as Error;
      if (attempt < MAX_RETRIES) continue;
      throw lastError;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('Unexpected retry exhaustion');
}
