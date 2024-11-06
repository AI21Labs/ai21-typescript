import { Response as NodeResponse } from 'node-fetch';
import { Readable } from 'stream';
import { SSE_DATA_PREFIX } from './Consts';
import { StreamingDecodeError } from '../errors';



export interface SSEDecoder {
    decode(line: string): string | null;
    iterLines(response: NodeResponse): AsyncIterableIterator<string>;
  }
  
export class DefaultSSEDecoder implements SSEDecoder {
    decode(line: string): string | null {
      if (!line) return null;
  
      if (line.startsWith(SSE_DATA_PREFIX)) {
        return line.slice(SSE_DATA_PREFIX.length);
      }
  
      throw new StreamingDecodeError(`Invalid SSE line: ${line}`);
    }
  
    async *iterLines(response: NodeResponse): AsyncIterableIterator<string> {
      if (!response.body) {
        throw new Error('Response body is null');
      }
  
      const webReadableStream = Readable.toWeb(response.body as any) as ReadableStream;
      const reader = webReadableStream.getReader();
  
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