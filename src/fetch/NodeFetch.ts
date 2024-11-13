// import { RequestInit as NodeRequestInit } from 'node-fetch';

import { Fetch } from "./BaseFetch";

export class NodeFetch extends Fetch {
    async call(url: string, options?: RequestInit): Promise<Response> {
        const nodeFetch = (await import("node-fetch")).default;
        // @ts-ignore
        return nodeFetch(url, options);
    }
}