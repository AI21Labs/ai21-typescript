import { FinalRequestOptions, UnifiedResponse } from "types";
import { Fetch } from "./BaseFetch";

export class NodeFetch extends Fetch {
    async call(url: string, options: FinalRequestOptions): Promise<UnifiedResponse> {
        const nodeFetchModule = await import("node-fetch");
        const nodeFetch = nodeFetchModule.default;

        return nodeFetch(url, {
            method: options?.method,
            headers: options.headers as Record<string, string>,
            body: options?.body ? JSON.stringify(options.body) : undefined,
        });
    }
}