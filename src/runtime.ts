import { BrowserFetch, Fetch, NodeFetch } from './fetch';


export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * A Web Worker is a background thread that runs JavaScript code separate from the main thread.
 * Web Workers enable concurrent processing by:
 * - Running CPU-intensive tasks without blocking the UI
 * - Performing background operations like data fetching and processing
 * - Operating independently from the main window context
 */
export const isWebWorker =
  typeof self === 'object' &&
  typeof self?.importScripts === 'function' &&
  (self.constructor?.name === 'DedicatedWorkerGlobalScope' ||
    self.constructor?.name === 'ServiceWorkerGlobalScope' ||
    self.constructor?.name === 'SharedWorkerGlobalScope');

export const isNode =
  typeof process !== 'undefined' && Boolean(process.version) && Boolean(process.versions?.node);

export function createFetchInstance(): Fetch {
  if (isBrowser || isWebWorker) {
    return new BrowserFetch();
  }

  return new NodeFetch();
}
