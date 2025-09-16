import * as Models from '../../../../src/types';
import {Completions} from "../../../../src/resources/chat/completions";
import { APIClient } from '../../../../src/APIClient';
import { AI21Error } from '../../../../src/errors';


class MockAPIClient extends APIClient {
    public post = jest.fn();
  }
  

describe('Completions', () => {
  let completions: Completions;
  let mockClient: MockAPIClient;
  const dummyAPIKey = "test-api-key";

  beforeEach(() => {
    mockClient = new MockAPIClient({
        baseURL: 'https://api.example.com',
        maxRetries: 3,
        timeout: 5000,
      });

    completions = new Completions(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a non-streaming completion when stream is false', async () => {
    const body: Models.ChatCompletionCreateParamsNonStreaming = { 
        model: "jamba-mini",
        messages: [{role: "user", content: "Hello"}],
    };
    const options: Models.RequestOptions = { headers: { 'Authorization': `Bearer ${dummyAPIKey}` } };
    const expectedResponse: Models.ChatCompletionResponse = {
         id: "test-id",
         usage: {
            prompt_tokens: 10,
            completion_tokens: 10,
            total_tokens: 20
         },
         choices: [
            { message: { role: "assistant", content: 'Hi' }, index: 0 }
        ]
    };

    mockClient.post.mockResolvedValue(expectedResponse);

    const response = await completions.create(body, options);

    expect(mockClient.post).toHaveBeenCalledWith(
      '/chat/completions',
      { body, ...options, stream: false }
    );
    expect(response).toEqual(expectedResponse);
  });

  it('should create a streaming completion when stream is true', async () => {
    const body: Models.ChatCompletionCreateParamsStreaming = { model: "jamba-mini", messages: [{role: "user", content: "Hello"}], stream: true };
    const options: Models.RequestOptions = { headers: { 'Authorization': `Bearer ${dummyAPIKey}` } };
    const expectedStream: Models.ChatCompletionChunk = {
        id: "test-id",
        choices: [{
            index: 0,
            delta: { role: "assistant", content: 'Hi' },
        }],
        usage: {
            prompt_tokens: 10,
            completion_tokens: 10,
            total_tokens: 20
         },
    };

    mockClient.post.mockResolvedValue(expectedStream);

    const response = await completions.create(body, options);

    expect(mockClient.post).toHaveBeenCalledWith(
      '/chat/completions',
      { body, ...options, stream: true }
    );
    expect(response).toBe(expectedStream);
  });

  it('should use default options when options parameter is omitted', async () => {
    const body: Models.ChatCompletionCreateParamsNonStreaming = { model: "jamba-mini", messages: [{role: "user", content: "Hello"}], stream: false };
    const expectedResponse: Models.ChatCompletionResponse = {
        id: "test-id",
        usage: {
            prompt_tokens: 10,
            completion_tokens: 10,
            total_tokens: 20
         },
         choices: [{ message: { role: "assistant", content: 'Hi' }, index: 0 }]
    };

    mockClient.post.mockResolvedValue(expectedResponse);

    const response = await completions.create(body);

    expect(mockClient.post).toHaveBeenCalledWith(
      '/chat/completions',
      { body, stream: false }
    );
    expect(response).toEqual(expectedResponse);
  });

  it('should handle errors thrown by the API client', async () => {
    const body: Models.ChatCompletionCreateParamsNonStreaming = { model: "jamba-mini", messages: [{role: "user", content: "Hello"}], stream: false };
    const error = new AI21Error();

    mockClient.post.mockRejectedValue(error);

    await expect(completions.create(body)).rejects.toThrow();
  });
});
