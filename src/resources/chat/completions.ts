import * as Models from '../../types';
import { APIResource } from '../../APIResource';
import { Stream } from '../../streaming';

const deprecatedModels = ['jamba-mini-1.6', 'jamba-large-1.6'];

export class Completions extends APIResource {
  create(
    body: Models.ChatCompletionCreateParamsNonStreaming,
    options?: Models.RequestOptions,
  ): Promise<Models.ChatCompletionResponse>;

  create(
    body: Models.ChatCompletionCreateParamsStreaming,
    options?: Models.RequestOptions,
  ): Promise<Stream<Models.ChatCompletionChunk>>;

  create(
    body: Models.ChatCompletionCreateParams,
    options?: Models.RequestOptions,
  ): Promise<Stream<Models.ChatCompletionChunk> | Models.ChatCompletionResponse>;

  create(body: Models.ChatCompletionCreateParams, options?: Models.RequestOptions) {
    // Check for deprecated models
    if (deprecatedModels.includes(body.model)) {
      console.warn(
        `Warning: The model "${body.model}" is deprecated and will be removed in a future release.
         Please use jamba-mini or jamba-large instead.`,
      );
    }

    return this.client.post<Models.ChatCompletionCreateParams, Models.ChatCompletionResponse>(
      '/chat/completions',
      {
        body,
        ...options,
        stream: body.stream ?? false,
      } as Models.RequestOptions<Models.ChatCompletionCreateParams>,
    ) as Promise<Models.ChatCompletionResponse> | Promise<Stream<Models.ChatCompletionChunk>>;
  }
}
