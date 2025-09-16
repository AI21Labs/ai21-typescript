import * as Models from '../../../src/types';
import { Files } from '../../../src/resources/library/files';
import { APIClient } from '../../../src/APIClient';

class MockAPIClient extends APIClient {
  public upload = jest.fn();
  public get = jest.fn();
  public delete = jest.fn();
  public put = jest.fn();
}

describe('RAGEngine', () => {
  let files: Files;
  let mockClient: MockAPIClient;
  const dummyAPIKey = "test-api-key";
  const options: Models.RequestOptions = { headers: { 'Authorization': `Bearer ${dummyAPIKey}` } };

  beforeEach(() => {
    mockClient = new MockAPIClient({
      baseURL: 'https://api.example.com',
      maxRetries: 3,
      timeout: 5000,
    });

    files = new Files(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file and return the fileId', async () => {
    const fileInput = 'path/to/file.txt';
    const body = { file: fileInput, path: 'path' };
    const expectedResponse = { fileId: '12345' };

    mockClient.upload.mockResolvedValue(expectedResponse);

    const response = await files.create(body);

    expect(mockClient.upload).toHaveBeenCalledWith(
      '/library/files',
      fileInput,
      {
        body: { path: 'path' },
      }
    );
    expect(response).toEqual(expectedResponse);
  });

  it('should get a file by ID and return the response', async () => {
    const fileId = '12345';
    const expectedResponse = { id: fileId, name: 'file.txt' };

    mockClient.get.mockResolvedValue(expectedResponse);

    const response = await files.get(fileId, options);

    expect(mockClient.get).toHaveBeenCalledWith(
      `/library/files/${fileId}`,
      { ...options }
    );
    expect(response).toEqual(expectedResponse);
  });

  it('should delete a file by ID', async () => {
    const fileId = '12345';

    mockClient.delete.mockResolvedValue(null);

    const response = await files.delete(fileId, options);

    expect(mockClient.delete).toHaveBeenCalledWith(
      `/library/files/${fileId}`,
      { ...options } 
    );
    expect(response).toBeNull();
  });

  it('should update a file by ID and return null', async () => {
    const fileId = '12345';
    const body = { fileId, labels: ['test'], publicUrl: 'https://example.com' };

    mockClient.put.mockResolvedValue(null);

    const response = await files.update(body);

    expect(mockClient.put).toHaveBeenCalledWith(
      `/library/files/${fileId}`,
      { body },
    );
    expect(response).toBeNull();
  });

  it('should list files and return the response', async () => {
    const filters = { limit: 4 };
    const expectedResponse = [{ id: '12345', name: 'file.txt' }];

    mockClient.get.mockResolvedValue(expectedResponse);

    const response = await files.list(filters, options);

    expect(mockClient.get).toHaveBeenCalledWith(
      '/library/files',
      {
        query: filters,
        ...options,
      }
    );
    expect(response).toEqual(expectedResponse);
  });
});
