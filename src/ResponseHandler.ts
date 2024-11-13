import { APIResponseProps } from './types';
import { AI21Error } from './errors';
import { Stream } from './Streaming';

type APIResponse<T> = {
  data?: T;
  response: Response;
};

export async function handleAPIResponse<T>({
  response,
  options,
}: APIResponseProps): Promise<Stream<T> | Promise<APIResponse<T>>> {
  if (options.stream) {
    if (!response.body) {
      throw new AI21Error('Response body is null');
    }
    return new Stream<T>(response);
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ? await response.json() : null;
}
