import { BrowserFetch, Fetch, NodeFetch } from 'fetch';

export const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
export const isWebWorker =
    typeof self === "object" &&
    // @ts-ignore
    typeof self?.importScripts === "function" &&
    (self.constructor?.name === "DedicatedWorkerGlobalScope" ||
        self.constructor?.name === "ServiceWorkerGlobalScope" ||
        self.constructor?.name === "SharedWorkerGlobalScope");


export const isNode = typeof process !== "undefined" && Boolean(process.version) && Boolean(process.versions?.node);

export const getReadableStream = async (responseBody: ReadableStream<Uint8Array>): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
    if (isBrowser || isWebWorker) {
        return responseBody.getReader();
    } else {
        // @ts-ignore - ReadableStream.from() is available in Node.js but TypeScript doesn't recognize it
        return (await import("stream/web")).ReadableStream.from(responseBody).getReader();
    }
};


export function createFetchInstance(): Fetch {
    if (isBrowser || isWebWorker) {
        return new BrowserFetch();
    } else {
        return new NodeFetch();
    }
}