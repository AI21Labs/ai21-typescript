import { BrowserFetch, Fetch, NodeFetch } from 'fetch';

export const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
export const isWebWorker =
    typeof self === "object" &&
    typeof self?.importScripts === "function" &&
    (self.constructor?.name === "DedicatedWorkerGlobalScope" ||
        self.constructor?.name === "ServiceWorkerGlobalScope" ||
        self.constructor?.name === "SharedWorkerGlobalScope");


export const isNode = typeof process !== "undefined" && Boolean(process.version) && Boolean(process.versions?.node);

export function createFetchInstance(): Fetch {
    if (isBrowser || isWebWorker) {
        return new BrowserFetch();
    } else {
        return new NodeFetch();
    }
}