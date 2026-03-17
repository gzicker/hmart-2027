export const VTEX_CONFIG = {
  account: 'hmartusqa',
  proxyBaseUrl: 'https://mute-feather-1655.gustavobzicker.workers.dev',
  salesChannel: '1',
  locale: 'en-US',
  get checkoutUrl() {
    return `https://${this.account}.vtexcommercestable.com.br/checkout`;
  },
};

export class VtexApiError extends Error {
  constructor(message: string, public status: number, public endpoint: string, public responseBody?: unknown) {
    super(message);
    this.name = 'VtexApiError';
  }
}

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
      throw new VtexApiError(`VTEX API Error: ${response.status}`, response.status, path, responseBody);
    }
    const text = await response.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timer);
  }
}
