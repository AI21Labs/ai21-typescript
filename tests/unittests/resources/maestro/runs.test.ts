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
        requirements_result: [],
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
        tools: ['web_search', 'file_search'],
        tool_resources: {
          file_search: {
            file_ids: ['file_123', 'file_456'],
            labels: ['ai', 'ml', 'nlp'],
          },
          web_search: {
            urls: ['https://arxiv.org', 'https://openai.com'],
          },
        },
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
          file_search: {
            file_ids: ['file_123', 'file_456'],
            labels: ['ai', 'ml', 'nlp'],
          },
          web_search: {
            urls: ['https://arxiv.org', 'https://openai.com'],
          },
        },
        requirements_result: [
          {
            score: 0.95,
            finish_reason: 'completed',
            requirements: {
              name: 'accuracy',
              description: 'Information should be accurate and up-to-date',
              score: 0.95,
              reason: 'All sources are recent and credible',
            },
          },
        ],
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
          web_search: {
            urls: ['https://arxiv.org', 'https://openai.com'],
          },
        },
        requirements_result: [
          {
            score: 0.92,
            finish_reason: 'completed',
            requirements: {
              name: 'accuracy',
              description: 'Information should be accurate and up-to-date',
              score: 0.92,
              reason: 'Sources are recent but some claims need verification',
            },
          },
        ],
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

  describe('create_and_poll', () => {
    it('should create and poll until completion with default options', async () => {
      const body: Models.MaestroRunRequest = {
        input: 'Test input',
      };

      const createResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'in_progress',
        result: null,
        data_sources: {},
        requirements_result: [],
      };

      const completedResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'completed',
        result: 'Task completed successfully',
        data_sources: {},
        requirements_result: [],
      };

      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockResolvedValue(completedResponse);

      const response = await runs.create_and_poll(body);

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
        requirements_result: [],
      };

      const completedResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'completed',
        result: 'Task completed successfully',
        data_sources: {},
        requirements_result: [],
      };

      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockResolvedValue(completedResponse);

      const response = await runs.create_and_poll(body, options);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(mockClient.get).toHaveBeenCalledWith('/maestro/runs/run_123');
      expect(response).toEqual(completedResponse);
    });

    it('should call create_and_poll with correct parameters', async () => {
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
        requirements_result: [],
      };

      const completedResponse: Models.MaestroRunResponse = {
        id: 'run_123',
        status: 'completed',
        result: 'Task completed successfully',
        data_sources: {},
        requirements_result: [],
      };

      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockResolvedValue(completedResponse);

      const response = await runs.create_and_poll(body, options);

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

      await expect(runs.create_and_poll(body)).rejects.toThrow();
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
        requirements_result: [],
      };

      const error = new AI21Error();
      mockClient.post.mockResolvedValue(createResponse);
      mockClient.get.mockRejectedValue(error);

      await expect(runs.create_and_poll(body)).rejects.toThrow();
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
        requirements_result: [],
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
        requirements_result: [],
      };

      mockClient.post.mockResolvedValue(expectedResponse);

      const response = await runs.create(body);

      expect(mockClient.post).toHaveBeenCalledWith('/maestro/runs', { body });
      expect(response).toEqual(expectedResponse);
    });
  });
});
