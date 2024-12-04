export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type APIResponseProps = {
  response: CrossPlatformResponse;
  options: FinalRequestOptions;
  controller?: AbortController;
};

export type RequestOptions<Req = unknown | Record<string, unknown> | ArrayBufferView | ArrayBuffer> = {
  method?: HTTPMethod;
  path?: string;
  query?: Req | undefined;
  body?: Req | UnifiedFormData | string | null | undefined;
  headers?: Headers | undefined;

  maxRetries?: number;
  stream?: boolean | undefined;
  timeout?: number;
};

export type FinalRequestOptions = RequestOptions & {
  method: HTTPMethod;
  path: string;
};

export type DefaultQuery = Record<string, unknown>;
export type Headers = Record<string, string | null | undefined>;

// Platforms specific types for NodeJS and Browser
export type CrossPlatformResponse = Response | import('node-fetch').Response;
export type CrossPlatformReadableStream = ReadableStream<Uint8Array> | import('stream/web').ReadableStream;

export type UnifiedFormData = FormData | import('form-data');

export type FormDataRequest = { formData: UnifiedFormData; headers: Headers };

