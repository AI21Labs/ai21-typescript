import { FinalRequestOptions, CrossPlatformResponse } from 'types';
import { Fetch } from './BaseFetch';
import { Stream, NodeSSEDecoder } from '../streaming';

export class NodeFetch extends Fetch {
  async call(url: string, options: FinalRequestOptions): Promise<CrossPlatformResponse> {
    const nodeFetchModule = await import('node-fetch');
    const nodeFetch = nodeFetchModule.default;

    return nodeFetch(url, {
      method: options?.method,
      headers: options.headers as Record<string, string>,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
  }

  handleStream<T>(response: CrossPlatformResponse): Stream<T> {
    type NodeRespose = import('node-fetch').Response;
    return new Stream<T>(response as NodeRespose, new NodeSSEDecoder());
  }
}
