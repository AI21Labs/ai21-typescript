import { Stream } from '../streaming';
import { AI21Error } from '../errors';
import { FinalRequestOptions, CrossPlatformResponse } from '../types';
import { APIResponseProps } from '../types/API';

export type APIResponse<T> = {
  data?: T;
  response: CrossPlatformResponse;
};
export abstract class BaseFetch {
  abstract call(url: string, options: FinalRequestOptions): Promise<CrossPlatformResponse>;
  async handleResponse<T>({ response, options }: APIResponseProps) {
    if (options.stream) {
      if (!response.body) {
        throw new AI21Error('Response body is null');
      }

      return this.handleStream<T>(response);
    }

    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json') ? await response.json() : null;
  }
  abstract handleStream<T>(response: CrossPlatformResponse): Stream<T>;
}
