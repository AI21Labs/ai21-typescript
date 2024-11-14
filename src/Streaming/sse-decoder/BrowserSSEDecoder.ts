import { CrossPlatformResponse } from 'types';
import { BaseSSEDecoder } from './BaseSSEDecoder';

export class BrowserSSEDecoder extends BaseSSEDecoder {
  async *iterLines(response: CrossPlatformResponse): AsyncIterableIterator<string> {
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const body = response.body as ReadableStream<Uint8Array>;
    yield* this._iterLines(body.getReader());
  }
}
