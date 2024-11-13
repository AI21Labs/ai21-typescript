export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type APIResponseProps = {
  response: Response;
  options: FinalRequestOptions;
  controller: AbortController;
};

export type RequestOptions<
  Req = unknown | Record<string, unknown> | ArrayBufferView | ArrayBuffer,
> = {
  method?: HTTPMethod;
  path?: string;
  query?: Req | undefined;
  body?: Req | null | undefined;
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
