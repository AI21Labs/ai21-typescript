import { FinalRequestOptions, UnifiedResponse } from 'types';
import { Fetch } from './BaseFetch';
import { Stream } from 'Streaming';
import { BrowserSSEDecoder } from 'Streaming/SSEDecoder';

export class BrowserFetch extends Fetch {
    call(url: string, options: FinalRequestOptions): Promise<UnifiedResponse> {
        const controller = new AbortController();

        return fetch(url, {
            method: options?.method,
            headers: options?.headers as HeadersInit,
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controller.signal,
        });
    }

    handleStream<T>(response: UnifiedResponse): Stream<T> {
        return new Stream<T>(response as Response, new BrowserSSEDecoder());
    }
}
