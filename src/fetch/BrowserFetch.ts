import { FinalRequestOptions, UnifiedResponse } from 'types';
import { Fetch } from './BaseFetch';

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
}
