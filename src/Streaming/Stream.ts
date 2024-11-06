import { Response as NodeResponse } from 'node-fetch';
import { DefaultSSEDecoder } from './SSEDecoder';
import { SSEDecoder } from './SSEDecoder';
import { SSE_DONE_MSG } from './Consts';
import { StreamingDecodeError } from '../errors';

function getStreamMessage<T>(chunk: string): T {
  try {
    return JSON.parse(chunk);
  } catch {
    throw new StreamingDecodeError(chunk);
  }
}

export class Stream<T> implements AsyncIterableIterator<T> {
  private decoder: SSEDecoder;
  private iterator: AsyncIterableIterator<T>;

  constructor(
    private response: NodeResponse,
    decoder?: SSEDecoder,
  ) {
    this.decoder = decoder || new DefaultSSEDecoder();
    this.iterator = this.stream();
  }

  private async *stream(): AsyncIterableIterator<T> {
    for await (const chunk of this.decoder.iterLines(this.response)) {
      if (chunk === SSE_DONE_MSG) break;
      yield getStreamMessage(chunk);
    }
  }
  async next(): Promise<IteratorResult<T>> {
    return this.iterator.next();
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this;
  }
}
