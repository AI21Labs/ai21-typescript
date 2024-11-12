import * as Types from './types';
import { AI21EnvConfig } from './EnvConfig';
import { MissingAPIKeyError } from './errors';
import { Chat } from './resources/chat';
import { APIClient } from './APIClient';
import { Headers } from './types';
import { ConversationalRag } from './resources/rag/conversationalRag';

export type ClientOptions = {
  baseURL?: string;
  apiKey?: string;
  maxRetries?: number;
  timeout?: number;
  via?: string | null;
  defaultHeaders?: Headers;
  dangerouslyAllowBrowser?: boolean;
};

export class AI21 extends APIClient {
  protected options: ClientOptions;
  private apiKey: string;
  private via: string | null;

  constructor({
    apiKey = AI21EnvConfig.API_KEY,
    baseURL = AI21EnvConfig.BASE_URL,
    timeout = AI21EnvConfig.TIMEOUT_SECONDS,
    maxRetries,
    via,
    ...opts
  }: ClientOptions) {
    const options: ClientOptions = {
      apiKey,
      baseURL,
      timeout,
      maxRetries,
      via,
      ...opts,
    };

    super({
      baseURL,
      timeout,
      maxRetries,
    });

    if (apiKey === undefined) {
      throw new MissingAPIKeyError();
    }

    this.apiKey = apiKey;
    this.via = via ?? null;
    this.options = options;
  }

  // Resources
  chat: Chat = new Chat(this);
  conversationalRag: ConversationalRag = new ConversationalRag(this);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override authHeaders(_: Types.FinalRequestOptions): Types.Headers {
    return {
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  protected override defaultHeaders(opts: Types.FinalRequestOptions): Types.Headers {
    return {
      ...super.defaultHeaders(opts),
      'User-Agent': this.getUserAgent(),
    };
  }

  protected override getUserAgent(): string {
    let userAgent = super.getUserAgent();

    if (this.via) {
      userAgent += ` via ${this.via}`;
    }
    return userAgent;
  }
}
