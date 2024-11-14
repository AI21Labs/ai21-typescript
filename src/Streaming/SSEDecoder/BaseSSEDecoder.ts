import { SSE_DATA_PREFIX } from '../Consts';
import { StreamingDecodeError } from '../../errors';
import { CrossPlatformResponse } from '../../types';
import { TextDecoder } from 'util';

export interface SSEDecoder {
  decode(line: string): string | null;
  iterLines(response: CrossPlatformResponse): AsyncIterableIterator<string>;
}

export abstract class BaseSSEDecoder implements SSEDecoder {
  decode(line: string): string | null {
    if (!line) return null;

    if (line.startsWith(SSE_DATA_PREFIX)) {
      return line.slice(SSE_DATA_PREFIX.length);
    }

    throw new StreamingDecodeError(`Invalid SSE line: ${line}`);
  }

  abstract iterLines(response: CrossPlatformResponse): AsyncIterableIterator<string>;

  async *_iterLines(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncIterableIterator<string> {
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (buffer.length > 0) {
            const decoded = this.decode(buffer.trim());
            if (decoded) yield decoded;
          }
          break;
        }

        buffer += new TextDecoder().decode(value);
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const decoded = this.decode(line.trim());
          if (decoded) yield decoded;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
