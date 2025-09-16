import { Maestro } from '../../../../src/resources/maestro/maestro';
import { Beta } from '../../../../src/resources/maestro/beta';
import { Runs } from '../../../../src/resources/maestro/runs';
import { APIClient } from '../../../../src/APIClient';

class MockAPIClient extends APIClient {
  public post = jest.fn();
  public get = jest.fn();
}

describe('Maestro', () => {
  let maestro: Maestro;
  let mockClient: MockAPIClient;

  beforeEach(() => {
    mockClient = new MockAPIClient({
      baseURL: 'https://api.example.com',
      maxRetries: 3,
      timeout: 5000,
    });

    maestro = new Maestro(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with a Runs instance', () => {
    expect(maestro).toBeInstanceOf(Maestro);
    expect(maestro.runs).toBeInstanceOf(Runs);
  });

  it('should share the same client with runs', () => {
    expect(maestro.runs['client']).toBe(mockClient);
  });
});

describe('Beta', () => {
  let beta: Beta;
  let mockClient: MockAPIClient;

  beforeEach(() => {
    mockClient = new MockAPIClient({
      baseURL: 'https://api.example.com',
      maxRetries: 3,
      timeout: 5000,
    });

    beta = new Beta(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with a Maestro instance', () => {
    expect(beta).toBeInstanceOf(Beta);
    expect(beta.maestro).toBeInstanceOf(Maestro);
  });

  it('should have access to runs through maestro', () => {
    expect(beta.maestro.runs).toBeInstanceOf(Runs);
  });

  it('should share the same client through the hierarchy', () => {
    expect(beta.maestro['client']).toBe(mockClient);
    expect(beta.maestro.runs['client']).toBe(mockClient);
  });
});
