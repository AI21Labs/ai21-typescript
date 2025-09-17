import * as Models from '../../../../src/types';
import { Runs } from '../../../../src/resources/maestro/runs';
import { APIClient } from '../../../../src/APIClient';
import { AI21Error } from '../../../../src/errors';

class MockAPIClient extends APIClient {
  public post = jest.fn();
  public get = jest.fn();
}

describe('Maestro Runs', () => {
  let runs: Runs;
  let mockClient: MockAPIClient;

  beforeEach(() => {
    mockClient = new MockAPIClient({
      baseURL: 'https://api.example.com',
      maxRetries: 3,
      timeout: 5000,
    });

    runs = new Runs(mockClient);
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const defaultRequirementsResult = {
    score: 0,
    finish_reason: null,
    requirements: [
      {
        name: 'accuracy',
        description: 'Information should be accurate and up-to-date',
        score: 0,
        reason: 'All sources are recent and credible',
      },
    ],
  };

  describe('create', () => {
    it('should create a maestro run with minimal required fields', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Write a summary of the latest AI developments',
      };

      const expectedResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'in_progress',
        result: null,
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      mockClient.post.mockResolvedValue(expectedResponse);

      const response = await runs.create(body);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(response).toEqual(expectedResponse);
    });

    it('should create a maestro run with all optional fields', async () => {
      const body: Models.MaestroRunRequest = {
        input: [
          { role: 'user', content: 'What are the latest trends in AI?' },
          { role: 'assistant', content: 'I need more context to provide a comprehensive answer.' },
          { role: 'user', content: 'Focus on machine learning and natural language processing.' },
        ],
        requirements: [
          {
            name: 'accuracy',
            description: 'Information should be accurate and up-to-date',
            isMandatory: true,
          },
          { name: 'completeness', description: 'Cover all major areas', isMandatory: false },
        ],
        tools: [
          { type: 'web_search', urls: ['https://arxiv.org', 'https://openai.com'] },
          { type: 'file_search', file_ids: ['file_123', 'file_456'], labels: ['ai', 'ml', 'nlp'] },
          {
            type: 'http',
            function: {
              name: 'get_weather',
              description: 'Get the weather for a given city',
              parameters: {
                type: 'object',
                properties: { city: { type: 'string', description: 'The city to get the weather for' } },
                required: ['city'],
              },
            },
            endpoint: {
              url: 'https://api.openweathermap.org/data/2.5/weather',
              headers: { Authorization: 'Bearer 1234567890' },
            },
          },
          {
            type: 'mcp',
            server_label: 'openai',
            server_url: 'https://my-mcp-server.com',
            headers: { Authorization: 'Bearer 1234567890' },
            allowed_tools: ['get_weather'],
          },
        ],
        models: ['jamba-large', 'gpt-4o'],
        budget: 'high',
        include: ['data_sources', 'requirements_result'],
        response_language: 'english',
      };

      const expectedResponse: Models.MaestroRunResponse = {
        id: 'run_456',
        status: 'in_progress',
        result: null,
        data_sources: {
          file_search: [
            {
              file_id: 'file_123',
              file_name: 'file_123.txt',
              score: 0.92,
              order: 1,
            },
            {
              file_id: 'file_456',
              file_name: 'file_456.txt',
              score: 0.92,
              order: 2,
            },
          ],
          web_search: [
            {
              url: 'https://arxiv.org',
              score: 0.92,
              text: 'Here is a comprehensive summary of the latest AI developments...',
            },
          ],
        },
        requirements_result: {
          score: 0.95,
          finish_reason: 'completed',
          requirements: [
            {
              name: 'accuracy',
              description: 'Information should be accurate and up-to-date',
              score: 0.95,
              reason: 'All sources are recent and credible',
            },
          ],
        },
      };

      mockClient.post.mockResolvedValue(expectedResponse);

      const response = await runs.create(body);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(response).toEqual(expectedResponse);
    });

    it('should handle errors thrown by the API client', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Test input',
      };
      const error = new AI21Error();

      mockClient.post.mockRejectedValue(error);

      await expect(runs.create(body)).rejects.toThrow();
    });
  });

  describe('get', () => {
    it('should get a maestro run by ID', async () => {
      const runId = 'run_123';
      const expectedResponse: Models.MaestroRunResponse = {
        id: runId,
        status: 'completed',
        result: 'Here is a comprehensive summary of the latest AI developments...',
        data_sources: {
          web_search: [
            {
              score: 0.92,
              text: 'Here is a comprehensive summary of the latest AI developments...',
              url: 'https://arxiv.org',
            },
          ],
        },
        requirements_result: {
          score: 0.92,
          finish_reason: 'completed',
          requirements: [
            {
              name: 'accuracy',
              description: 'Information should be accurate and up-to-date',
              score: 0.92,
              reason: 'Sources are recent but some claims need verification',
            },
          ],
        },
      };

      mockClient.get.mockResolvedValue(expectedResponse);

      const response = await runs.get(runId);

      expect(mockClient.get).toHaveBeenCalledWith(`/maestro/runs/${runId}`);
      expect(response).toEqual(expectedResponse);
    });

    it('should handle errors when getting a run', async () => {
      const runId = 'run_123';
      const error = new AI21Error();

      mockClient.get.mockRejectedValue(error);

      await expect(runs.get(runId)).rejects.toThrow();
    });
  });

  describe('createAndPoll', () => {
    it('should create and poll until completion with default options', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Test input',
      };

      const createResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'in_progress',
        result: null,
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      const completedResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'completed',
        result: 'Task completed successfully',
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockResolvedValue(completedResponse);

      const response = await runs.createAndPoll(body);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(mockClient.get).toHaveBeenCalledWith('/maestro/runs/run_123');
      expect(response).toEqual(completedResponse);
    });

    it('should create and poll with custom timeout and interval', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Test input',
      };

      const options: Models.MaestroRunRequestOptions = {
        timeout: 60000,
        interval: 2000,
      };

      const createResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'in_progress',
        result: null,
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      const completedResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'completed',
        result: 'Task completed successfully',
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockResolvedValue(completedResponse);

      const response = await runs.createAndPoll(body, options);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(mockClient.get).toHaveBeenCalledWith('/maestro/runs/run_123');
      expect(response).toEqual(completedResponse);
    });

    it('should call createAndPoll with correct parameters', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Test input',
      };

      const options: Models.MaestroRunRequestOptions = {
        timeout: 60000,
        interval: 2000,
      };

      const createResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'in_progress',
        result: null,
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      const completedResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'completed',
        result: 'Task completed successfully',
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockResolvedValue(completedResponse);

      const response = await runs.createAndPoll(body, options);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(mockClient.get).toHaveBeenCalledWith('/maestro/runs/run_123');
      expect(response).toEqual(completedResponse);
    });

    it('should handle creation errors', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Test input',
      };

      const error = new AI21Error();
      mockClient.post.mockRejectedValue(error);

      await expect(runs.createAndPoll(body)).rejects.toThrow();
    });

    it('should handle polling errors', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Test input',
      };

      const createResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'in_progress',
        result: null,
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      const error = new AI21Error();
      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockRejectedValue(error);

      await expect(runs.createAndPoll(body)).rejects.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle string input type', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Simple string input for maestro run',
      };

      const expectedResponse: Models.MaestroRunResponse = {
        id: 'run_789',
        status: 'completed',
        result: 'Response to string input',
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      mockClient.post.mockResolvedValue(expectedResponse);

      const response = await runs.create(body);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(response).toEqual(expectedResponse);
    });

    it('should handle array input type', async () => {
      const body: Models.MaestroRunRequest = {
        input: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
      };

      const expectedResponse: Models.MaestroRunResponse = {
        id: 'run_789',
        status: 'completed',
        result: 'Response to array input',
        data_sources: {},
        requirements_result: defaultRequirementsResult,
      };

      mockClient.post.mockResolvedValue(expectedResponse);

      const response = await runs.create(body);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(response).toEqual(expectedResponse);
    });
  });
});
