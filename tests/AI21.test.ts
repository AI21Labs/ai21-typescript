import { AI21, ClientOptions } from '../src/AI21';
import { AI21Error, MissingAPIKeyError } from '../src/errors';
import { Chat } from '../src/resources/chat';

describe('AI21', () => {
  const mockApiKey = 'test-api-key';
  const defaultOptions: ClientOptions = {
    apiKey: mockApiKey,
    baseURL: 'https://some-url/v1',
    timeout: 600,
    dangerouslyAllowBrowser: true,  // Test env is in the browser and we need to allow it
  };

  describe('constructor', () => {
    it('should initialize with default options', () => {
      const client = new AI21({ apiKey: mockApiKey, dangerouslyAllowBrowser: true });
      expect(client).toBeInstanceOf(AI21);
      expect(client.chat).toBeInstanceOf(Chat);
    });

    it('should throw MissingAPIKeyError when no API key provided', () => {
      expect(() => new AI21({apiKey: undefined} as ClientOptions)).toThrow(MissingAPIKeyError);
    });

    it('should throw AI21Error when browser is detected without dangerouslyAllowBrowser option', () => {
      expect(() => new AI21({...defaultOptions, dangerouslyAllowBrowser: false})).toThrow(AI21Error);
    });

    it('should initialize with custom options', () => {
      const customOptions: ClientOptions = {
        ...defaultOptions,
        via: 'custom-app',
        maxRetries: 3,
        dangerouslyAllowBrowser: true,
      };

      const client = new AI21(customOptions);
      expect(client).toBeInstanceOf(AI21);
    });
  });

  describe('with headers', () => {
    let client: AI21;

    beforeEach(() => {
      client = new AI21(defaultOptions);
    });

    it('should generate correct auth headers', () => {
      const headers = client['authHeaders']({} as any);
      expect(headers).toEqual({
        Authorization: `Bearer ${mockApiKey}`,
      });
    });

    it('should generate correct default headers', () => {
      const headers = client['defaultHeaders']({} as any);
      expect(headers).toHaveProperty('User-Agent');
      expect(headers['User-Agent']).toContain('AI21 Typescript SDK');
    });

    it('should include via in user agent when provided', () => {
      const clientWithVia = new AI21({
        ...defaultOptions,
        via: 'custom-app',
      });
      
      const headers = clientWithVia['defaultHeaders']({} as any);
      expect(headers['User-Agent']).toContain('via custom-app');
    });
  });
}); 