import { AI21Error } from './errors';
import { VERSION } from './version';

import {
  RequestOptions,
  FinalRequestOptions,
  APIResponseProps,
  HTTPMethod,
  Headers,
  UnifiedResponse,
} from './types';
import { AI21EnvConfig } from './EnvConfig';
import { createFetchInstance } from 'envFetch';
import { Fetch } from 'fetch';

const validatePositiveInteger = (name: string, n: unknown): number => {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new AI21Error(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new AI21Error(`${name} must be a positive integer`);
  }
  return n;
};

export abstract class APIClient {
  protected baseURL: string;
  protected maxRetries: number;
  protected timeout: number;
  protected fetch: Fetch;

  constructor({
    baseURL,
    maxRetries = AI21EnvConfig.MAX_RETRIES,
    timeout = AI21EnvConfig.TIMEOUT_SECONDS,
    fetch = createFetchInstance(),
  }: {
    baseURL: string;
    maxRetries?: number | undefined;
    timeout: number | undefined;
    fetch?: Fetch;
  }) {
    this.baseURL = baseURL;
    this.maxRetries = validatePositiveInteger('maxRetries', maxRetries);
    this.timeout = validatePositiveInteger('timeout', timeout);
    this.fetch = fetch;
  }
  get<Req, Rsp>(path: string, opts?: RequestOptions<Req>): Promise<Rsp> {
    return this.makeRequest('get', path, opts);
  }

  post<Req, Rsp>(path: string, opts?: RequestOptions<Req>): Promise<Rsp> {
    return this.makeRequest('post', path, opts);
  }

  put<Req, Rsp>(path: string, opts?: RequestOptions<Req>): Promise<Rsp> {
    return this.makeRequest('put', path, opts);
  }

  delete<Req, Rsp>(path: string, opts?: RequestOptions<Req>): Promise<Rsp> {
    return this.makeRequest('delete', path, opts);
  }

  protected getUserAgent(): string {
    const platform =
      this.isRunningInBrowser() ?
        `browser/${typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'}`
      : `node/${process.version}`;
    return `AI21 Typescript SDK ${VERSION} ${platform}`;
  }

  protected defaultHeaders(opts: FinalRequestOptions): Headers {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this.getUserAgent(),
      ...this.authHeaders(opts),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected authHeaders(opts: FinalRequestOptions): Headers {
    return {};
  }

  private makeRequest<Req, Rsp>(method: HTTPMethod, path: string, opts?: RequestOptions<Req>): Promise<Rsp> {
    const options = {
      method,
      path,
      ...opts,
    };

    return this.performRequest(options as FinalRequestOptions).then(
      (response) => this.fetch.handleResponse<Rsp>(response) as Rsp,
    );
  }

  private async performRequest(options: FinalRequestOptions): Promise<APIResponseProps> {
    const url = `${this.baseURL}${options.path}`;

    const headers = {
      ...this.defaultHeaders(options),
      ...options.headers,
    };
    const response = await this.fetch.call(url, { ...options, headers });

    if (!response.ok) {
      throw new AI21Error(`Request failed with status ${response.status}. ${await response.text()}`);
    }

    return { response: response as UnifiedResponse, options };
  }

  protected isRunningInBrowser(): boolean {
    return (
      typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof fetch === 'function'
    );
  }
}
