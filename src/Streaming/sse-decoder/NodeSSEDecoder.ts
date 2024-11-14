import { CrossPlatformResponse } from 'types';
import { BaseSSEDecoder } from './BaseSSEDecoder';
import { StreamingDecodeError } from '../../errors';

export class NodeSSEDecoder extends BaseSSEDecoder {
  async *iterLines(response: CrossPlatformResponse): AsyncIterableIterator<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readerStream = (await import('stream/web')).ReadableStream as any;

    if (!response.body) {
      throw new StreamingDecodeError('Response body is null');
    }

    const reader = readerStream.from(response.body).getReader();
    yield* this._iterLines(reader);
  }
}
