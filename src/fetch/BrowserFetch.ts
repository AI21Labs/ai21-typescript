import { Fetch } from './BaseFetch';

export class BrowserFetch extends Fetch {
    call(url: string, options?: RequestInit): Promise<Response> {
        return fetch(url, options);
    }
}
