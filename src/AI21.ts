import * as Types from './types';
import { AI21EnvConfig } from './EnvConfig';
import { AI21Error, MissingAPIKeyError } from './errors';
import { Chat } from './resources/chat';
import { APIClient } from './APIClient';
import { Headers } from './types';
import { ConversationalRag } from './resources/rag/conversationalRag';
import * as Runtime from './runtime';

export interface ClientOptions {
  baseURL?: string | undefined;
  apiKey?: string | undefined;
  maxRetries?: number;
  timeout?: number;
  via?: string | null;
  defaultHeaders?: Headers;
  /**
   * By default, using this library on the client side is prohibited to prevent exposing your secret API credentials to potential attackers.
   * Only enable this option by setting it to `true` if you fully understand the risks and have implemented appropriate security measures.
   */
  dangerouslyAllowBrowser?: boolean;
}

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
  }: ClientOptions = {}) {
    const options: ClientOptions = {
      apiKey,
      baseURL,
      timeout,
      maxRetries,
      via,
      ...opts,
    };

    if (!options.dangerouslyAllowBrowser && Runtime.isBrowser) {
      throw new AI21Error(
        'AI21 client is not supported in the browser by default due to potential API key exposure. Use `dangerouslyAllowBrowser` option to `true` to override it.',
      );
    }

    if (apiKey === undefined) {
      throw new MissingAPIKeyError();
    }

    super({
      baseURL,
      timeout,
      maxRetries,
    });

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
