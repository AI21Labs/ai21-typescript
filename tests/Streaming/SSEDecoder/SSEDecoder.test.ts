import { BrowserSSEDecoder, NodeSSEDecoder } from '../../../src/streaming/sse-decoder';
import { StreamingDecodeError } from '../../../src/errors';
import { CrossPlatformResponse } from '../../../src/types';
import { TextEncoder } from 'util';
import { ReadableStream } from 'stream/web';

// Helper function to create a ReadableStream from a string (Node)
const createNodeReadableStream = async (data: string): Promise<any> => {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(data);

  return new ReadableStream({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  });
};

describe('SSEDecoder', () => {
  describe('decode', () => {
    const decoder = new (class extends BrowserSSEDecoder {})();

    it('should decode valid SSE data lines', () => {
      const line = 'data: Test message';
      const result = decoder.decode(line);
      expect(result).toBe('Test message');
    });

    it('should return null for empty lines', () => {
      const line = '';
      const result = decoder.decode(line);
      expect(result).toBeNull();
    });

    it('should throw StreamingDecodeError for invalid lines', () => {
      const line = 'event: Test event';
      expect(() => decoder.decode(line)).toThrow(StreamingDecodeError);
    });
  });

  describe('BrowserSSEDecoder iterLines', () => {
    const decoder = new BrowserSSEDecoder();

    it('should handle null response body', async () => {
      const mockResponse: CrossPlatformResponse = {
        body: null,
      } as CrossPlatformResponse;

      await expect(async () => {
        for await (const _ of decoder.iterLines(mockResponse)) {}
      }).rejects.toThrow('Response body is null');
    });
  });

  describe('NodeSSEDecoder iterLines', () => {
    const decoder = new NodeSSEDecoder();

    it('should iterate and decode all valid SSE lines', async () => {
      const sseData = `data: Node Message 1\n\ndata: Node Message 2\n`;
      const readableStream = await createNodeReadableStream(sseData);
      const mockResponse: CrossPlatformResponse = {
        body: readableStream,
      } as CrossPlatformResponse;

      const lines: string[] = [];
      for await (const line of decoder.iterLines(mockResponse)) {
        lines.push(line);
      }

      expect(lines).toEqual(['Node Message 1', 'Node Message 2']);
    });

    it('should handle null response body', async () => {
      const mockResponse: CrossPlatformResponse = {
        body: null,
      } as CrossPlatformResponse;

      await expect(async () => {
        for await (const _ of decoder.iterLines(mockResponse)) {}
      }).rejects.toThrow('Response body is null');
    });

    it('should handle incomplete lines at the end of the stream', async () => {
      const sseData = `data: Node Complete message\n\ndata: Node Incomplete`;
      const readableStream = await createNodeReadableStream(sseData);
      const mockResponse: CrossPlatformResponse = {
        body: readableStream,
      } as CrossPlatformResponse;

      const lines: string[] = [];
      for await (const line of decoder.iterLines(mockResponse)) {
        lines.push(line);
      }

      expect(lines).toEqual(['Node Complete message', 'Node Incomplete']);
    });
  });
});