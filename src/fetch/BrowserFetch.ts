import { FinalRequestOptions, CrossPlatformResponse } from 'types';
import { BaseFetch } from './BaseFetch';
import { Stream, BrowserSSEDecoder } from '../streaming';

export class BrowserFetch extends BaseFetch {
  call(url: string, options: FinalRequestOptions): Promise<CrossPlatformResponse> {
    const controller = new AbortController();

    return fetch(url, {
      method: options.method,
      headers: options?.headers ? options.headers as HeadersInit : undefined,
      body: options?.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  }

  handleStream<T>(response: CrossPlatformResponse): Stream<T> {
    return new Stream<T>(response as Response, new BrowserSSEDecoder());
  }
}
