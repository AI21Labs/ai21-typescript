import { AI21Error } from './errors';
import { VERSION } from './version';

import {
  RequestOptions,
  FinalRequestOptions,
  APIResponseProps,
  HTTPMethod,
  Headers,
  CrossPlatformResponse,
} from './types';
import { AI21EnvConfig } from './EnvConfig';
import { createFetchInstance, createFilesHandlerInstance } from './runtime';
import { Fetch } from 'fetch';
import { FilePathOrFileObject } from 'types/rag';
import { BaseFilesHandler } from 'files/BaseFilesHandler';

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
  protected filesHandler: BaseFilesHandler;

  constructor({
    baseURL,
    maxRetries = AI21EnvConfig.MAX_RETRIES,
    timeout = AI21EnvConfig.TIMEOUT_SECONDS,
    fetch = createFetchInstance(),
    filesHandler = createFilesHandlerInstance(),
  }: {
    baseURL: string;
    maxRetries?: number | undefined;
    timeout: number | undefined;
    fetch?: Fetch;
    filesHandler?: BaseFilesHandler;
  }) {
    this.baseURL = baseURL;
    this.maxRetries = validatePositiveInteger('maxRetries', maxRetries);
    this.timeout = validatePositiveInteger('timeout', timeout);
    this.fetch = fetch;
    this.filesHandler = filesHandler;
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

  async upload<Req, Rsp>(path: string, file: FilePathOrFileObject, opts?: RequestOptions<Req>): Promise<Rsp> {
    const formData = await this.filesHandler.createFormData(file);

    if (opts?.body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.filesHandler.appendBodyToFormData(formData, opts.body as Record<string, any>);
    }

    const headers = {
      ...opts?.headers,
      ...this.filesHandler.getMultipartFormDataHeaders(formData),
    };

    const options: FinalRequestOptions = {
      method: 'post',
      path: path,
      body: formData,
      headers,
    };

    return this.performRequest(options).then((response) => this.fetch.handleResponse<Rsp>(response) as Rsp);
  }

  protected getUserAgent(): string {
    const platform =
      this.isRunningInBrowser() ?
        `browser/${typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'}`
      : `node/${process.version}`;
    return `AI21 Typescript SDK ${VERSION} ${platform}`;
  }

  protected defaultHeaders(opts: FinalRequestOptions): Headers {
    const defaultHeaders = {
      Accept: 'application/json',
      'User-Agent': this.getUserAgent(),
      ...this.authHeaders(opts),
    };

    if (opts?.body instanceof FormData) {
      return defaultHeaders;
    }
    return { ...defaultHeaders, 'Content-Type': 'application/json' };
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
    let url = `${this.baseURL}${options.path}`;

    if (options.query) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryString = new URLSearchParams(options.query as Record<string, any>).toString();
      url += `?${queryString}`;
    }

    const headers = {
      ...this.defaultHeaders(options),
      ...options.headers,
    };

    const response = await this.fetch.call(url, { ...options, headers });

    if (!response.ok) {
      throw new AI21Error(`Request failed with status ${response.status}. ${await response.text()}`);
    }

    return { response: response as CrossPlatformResponse, options };
  }

  protected isRunningInBrowser(): boolean {
    return (
      typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof fetch === 'function'
    );
  }
}
